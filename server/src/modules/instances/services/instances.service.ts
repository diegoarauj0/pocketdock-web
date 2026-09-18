import { isAlreadyRunning, isAlreadyStopped, isDockerApiError } from "src/infrastructure/docker/docker.util";
import { ContainerErrorReason, InstanceContainerException } from "../exceptions/instanceContainer.exception";
import { DockerContainerService } from "src/infrastructure/docker/services/dockerContainer.service";
import { InstanceNotFoundException } from "../exceptions/instanceNotFoundException.exception";
import { InstanceRepository } from "../repositories/instance.repository";
import { CryptoService } from "src/common/services/crypto.service";
import { UserEntity } from "src/modules/users/user.entity";
import { INSTANCE_CONSTANT } from "../instance.constant";
import { InstanceEntity } from "../instance.entity";
import { Injectable, Logger } from "@nestjs/common";
import { setTimeout } from "node:timers/promises";
import { ContainerStats } from "dockerode";
import { env } from "src/config/env";

interface InterfaceCalculateUsage {
  percent: number;
  limit: number;
  used: number;
}

interface InterfaceState {
  memory: InterfaceCalculateUsage;
  cpu: InterfaceCalculateUsage;
  status: "running" | "stopped";
}

@Injectable()
export class InstancesService {
  private readonly logger = new Logger(InstancesService.name);

  constructor(
    private readonly dockerContainerService: DockerContainerService,
    private readonly instanceRepository: InstanceRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  public async create(user: UserEntity): Promise<InstanceEntity> {
    const id = this.cryptoService.randomUUID();
    const containerName = `${INSTANCE_CONSTANT.CONTAINER_NAME_PREFIX}-${id}`;

    try {
      const image = `${INSTANCE_CONSTANT.REPOSITORY}:${INSTANCE_CONSTANT.VERSION}`;

      const labels = {
        [INSTANCE_CONSTANT.LABEL_VERSION]: INSTANCE_CONSTANT.VERSION,
        [INSTANCE_CONSTANT.LABEL_TYPE]: INSTANCE_CONSTANT.TYPE,
        [INSTANCE_CONSTANT.LABEL_INSTANCE_ID]: id,
        [INSTANCE_CONSTANT.LABEL_MANAGED]: "true",

        "traefik.enable": "true",
        [`traefik.http.routers.${containerName}.rule`]: `Host(\`${id}.${env.INSTANCE_DOMAIN}\`)`,
        [`traefik.http.routers.${containerName}.entrypoints`]: "web",
        [`traefik.http.services.${containerName}.loadbalancer.server.port`]: `${INSTANCE_CONSTANT.PORT}`,
      };

      const hostConfig = {
        Memory: env.MAX_MEMORY_IN_MB * 1024 * 1024,
        NanoCpus: env.MAX_NANO_CPUS,
      };

      const networkingConfig = {
        EndpointsConfig: {
          [INSTANCE_CONSTANT.NETWORK]: {
            Aliases: [containerName],
          },
        },
      };

      await this.dockerContainerService.createContainer({
        name: containerName,
        image: image,
        hostConfig,
        networkingConfig,
        labels,
      });

      const defaultPassword = this.cryptoService.randomHash();

      await this.dockerContainerService.startContainer(containerName);

      await this.createSuperuser(containerName, user.email, defaultPassword);

      let instance = this.instanceRepository.create({
        containerName: containerName,
        userId: user.id,
        id,
        defaultPassword,
      });

      instance = await this.instanceRepository.save(instance);

      return instance;
    } catch (error) {
      this.logger.error("Failed to create instance container.", { userId: user.id, containerName });
      this.logger.error(error);

      const { affected } = await this.instanceRepository.delete(id);

      if (affected) {
        this.logger.warn(`Rolled back instance ${id}`);
      }

      try {
        const exists = await this.dockerContainerService.containerExists(containerName);

        if (exists) {
          await this.dockerContainerService.deleteContainer(containerName, true);
        }
      } catch (cleanupError) {
        this.logger.error("Failed to cleanup instance container.", cleanupError);
      }

      if (isDockerApiError(error)) {
        throw new InstanceContainerException(ContainerErrorReason.CREATE_FAILED);
      }

      throw error;
    }
  }

  public async findAllByUserId(userId: string): Promise<InstanceEntity[]> {
    return this.instanceRepository.findByUserId(userId);
  }

  public async findOwnedById(id: string, userId: string): Promise<InstanceEntity> {
    const instance = await this.instanceRepository.findByIdAndUserId(id, userId);

    if (instance === null) {
      throw new InstanceNotFoundException();
    }

    return instance;
  }

  public async stop(id: string, userId: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(id, userId);

    try {
      await this.dockerContainerService.stopContainer(instance.containerName);

      return instance;
    } catch (error) {
      this.logger.error("Failed to stop instance container.", { id });
      this.logger.error(error);

      if (isAlreadyStopped(error)) {
        return instance;
      }

      throw new InstanceContainerException(ContainerErrorReason.STOP_FAILED);
    }
  }

  public async start(id: string, userId: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(id, userId);

    try {
      await this.dockerContainerService.startContainer(instance.containerName);

      return instance;
    } catch (error) {
      this.logger.error("Failed to start instance container.", { id });
      this.logger.error(error);

      if (isAlreadyRunning(error)) {
        throw new InstanceContainerException(ContainerErrorReason.ALREADY_RUNNING);
      }

      throw new InstanceContainerException(ContainerErrorReason.START_FAILED);
    }
  }

  public async remove(id: string, userId: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(id, userId);

    try {
      await this.dockerContainerService.deleteContainer(instance.containerName, true);
    } catch {
      this.logger.error("Failed to remove instance container.", { id, containerName: instance.containerName });
      throw new InstanceContainerException(ContainerErrorReason.REMOVE_FAILED);
    }

    try {
      return await this.instanceRepository.remove(instance);
    } catch (error) {
      this.logger.error("Failed to remove instance database row.", { id });

      throw error;
    }
  }

  private calculateMemoryUsage(stats: ContainerStats): InterfaceCalculateUsage {
    const { memory_stats } = stats;

    const usedBytes = (memory_stats.usage || 0) - (memory_stats.stats?.cache || 0);

    const limitBytes = env.MAX_MEMORY_IN_MB * 1024 * 1024;

    return {
      used: usedBytes / 1024 / 1024,
      percent: (usedBytes / limitBytes) * 100,
      limit: env.MAX_MEMORY_IN_MB ?? 0,
    };
  }

  private calculateCpuUsage(stats: ContainerStats): InterfaceCalculateUsage {
    const { cpu_stats, precpu_stats } = stats;

    const cpuDelta = cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage;

    const systemDelta = cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage;

    const onlineCpus = cpu_stats.online_cpus;
    const cpuLimit = env.MAX_NANO_CPUS / 1_000_000_000;

    const usedCpus = (cpuDelta / systemDelta) * onlineCpus;
    const usagePercent = (usedCpus / cpuLimit) * 100;

    return {
      percent: usagePercent || 0,
      limit: cpuLimit || 0,
      used: usedCpus || 0,
    };
  }

  public async stats(id: string, userId: string): Promise<InterfaceState> {
    const instance = await this.findOwnedById(id, userId);
    const status = await this.dockerContainerService.getContainerStatus(instance.containerName);

    if (status.running === false || status.paused === true) {
      return {
        cpu: { percent: 0, limit: 0, used: 0 },
        memory: { percent: 0, limit: 0, used: 0 },
        status: "stopped",
      };
    }

    const stats = await this.dockerContainerService.getStatsContainer(instance.containerName);

    const cpu = this.calculateCpuUsage(stats);
    const memory = this.calculateMemoryUsage(stats);

    return { cpu, memory, status: "running" };
  }

  public async removeAllContainersByUserId(userId: string): Promise<void> {
    const instances = await this.instanceRepository.findByUserId(userId);

    for (const instance of instances) {
      void this.remove(instance.id, userId);
    }
  }

  private async createSuperuser(containerName: string, email: string, password: string): Promise<void> {
    const cmd = ["/pb/pocketbase", "superuser", "upsert", email, password];

    for (let attempt = 1; attempt <= INSTANCE_CONSTANT.SUPERUSER_CREATE_ATTEMPTS; attempt++) {
      try {
        const { exitCode, stdout, stderr } = await this.dockerContainerService.execContainer(containerName, cmd);

        if (exitCode === 0) {
          this.logger.log(`Superuser created for instance ${containerName}.`, { email });
          return;
        }

        this.logger.warn(
          `Superuser upsert failed (exit ${exitCode}) on attempt ${attempt} for instance ${containerName}.`,
          { stdout, stderr },
        );
      } catch (error) {
        this.logger.warn(`Superuser upsert attempt ${attempt} failed for instance ${containerName}.`, error);
      }

      await setTimeout(INSTANCE_CONSTANT.SUPERUSER_CREATE_RETRY_DELAY_MS);
    }

    throw new InstanceContainerException(ContainerErrorReason.SUPERUSER_CREATE_FAILED);
  }
}
