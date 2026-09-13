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
    const ID = this.cryptoService.randomUUID();
    const containerName = `${INSTANCE_CONSTANT.CONTAINER_NAME_PREFIX}-${ID}`;

    try {
      const image = `${INSTANCE_CONSTANT.REPOSITORY}:${INSTANCE_CONSTANT.VERSION}`;

      const labels = {
        [INSTANCE_CONSTANT.LABEL_VERSION]: INSTANCE_CONSTANT.VERSION,
        [INSTANCE_CONSTANT.LABEL_TYPE]: INSTANCE_CONSTANT.TYPE,
        [INSTANCE_CONSTANT.LABEL_INSTANCE_ID]: ID,
        [INSTANCE_CONSTANT.LABEL_MANAGED]: "true",
      };

      const hostConfig = {
        Memory: env.MAX_MEMORY_IN_MB * 1024 * 1024,
        NanoCpus: env.MAX_NANO_CPUS,
      };

      await this.dockerContainerService.createContainer({
        name: containerName,
        image: image,
        hostConfig,
        labels,
      });

      await this.dockerContainerService.startContainer(containerName);

      let instance = this.instanceRepository.create({
        containerName: containerName,
        userID: user.ID,
        ID,
      });

      instance = await this.instanceRepository.save(instance);

      return instance;
    } catch (error) {
      this.logger.error("Failed to create instance container.", { userID: user.ID, containerName });
      this.logger.error(error);

      const { affected } = await this.instanceRepository.delete(ID);

      if (affected) {
        this.logger.warn(`Rolled back instance ${ID}`);
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

  public async findAllByUserId(userID: string): Promise<InstanceEntity[]> {
    return this.instanceRepository.findByUserId(userID);
  }

  public async findOwnedById(ID: string, userID: string): Promise<InstanceEntity> {
    const instance = await this.instanceRepository.findByIdAndUserId(ID, userID);

    if (instance === null) {
      throw new InstanceNotFoundException();
    }

    return instance;
  }

  public async stop(ID: string, userID: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(ID, userID);

    try {
      await this.dockerContainerService.stopContainer(instance.containerName);

      return instance;
    } catch (error) {
      this.logger.error("Failed to stop instance container.", { ID });
      this.logger.error(error);

      if (isAlreadyStopped(error)) {
        return instance;
      }

      throw new InstanceContainerException(ContainerErrorReason.STOP_FAILED);
    }
  }

  public async start(ID: string, userID: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(ID, userID);

    try {
      await this.dockerContainerService.startContainer(instance.containerName);

      return instance;
    } catch (error) {
      this.logger.error("Failed to start instance container.", { ID });
      this.logger.error(error);

      if (isAlreadyRunning(error)) {
        throw new InstanceContainerException(ContainerErrorReason.ALREADY_RUNNING);
      }

      throw new InstanceContainerException(ContainerErrorReason.START_FAILED);
    }
  }

  public async remove(ID: string, userID: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(ID, userID);

    try {
      await this.dockerContainerService.deleteContainer(instance.containerName, true);
    } catch {
      this.logger.error("Failed to remove instance container.", { ID, containerName: instance.containerName });
      throw new InstanceContainerException(ContainerErrorReason.REMOVE_FAILED);
    }

    try {
      return await this.instanceRepository.remove(instance);
    } catch (error) {
      this.logger.error("Failed to remove instance database row.", { ID });

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

  public async stats(ID: string, userID: string): Promise<InterfaceState> {
    const instance = await this.findOwnedById(ID, userID);
    const status = await this.dockerContainerService.getContainerStatus(instance.containerName);

    if (status.running === false || status.paused === true) {
      return {
        cpu: this.zeroUsage(),
        memory: this.zeroUsage(),
        status: "stopped",
      };
    }

    const stats = await this.dockerContainerService.getStatsContainer(instance.containerName);

    const cpu = this.calculateCpuUsage(stats);
    const memory = this.calculateMemoryUsage(stats);

    return {
      cpu,
      memory,
      status: "running",
    };
  }

  private zeroUsage(): InterfaceCalculateUsage {
    return {
      percent: 0,
      limit: 0,
      used: 0,
    };
  }
}
