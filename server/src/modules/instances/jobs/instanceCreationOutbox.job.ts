import { ContainerErrorReason, InstanceContainerException } from "../exceptions/instanceContainer.exception";
import { DockerContainerService } from "src/infrastructure/docker/services/dockerContainer.service";
import { OutboxEventEntity, OutboxEventStatus } from "src/infrastructure/outbox/outboxEvent.entity";
import { OutboxEventService } from "src/infrastructure/outbox/services/outboxEvent.service";
import { InstancesService } from "../services/instances.service";
import { INSTANCE_CONSTANT } from "../instance.constant";
import { Injectable, Logger } from "@nestjs/common";
import { InstanceStatus } from "../instance.entity";
import { setTimeout } from "node:timers/promises";
import { OnEvent } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import { env } from "src/config/env";

interface InterfacePayload {
  instanceId: string;
  containerName: string;
  defaultPassword: string;
  user: { id: string; email: string };
}

@Injectable()
export class InstanceCreationOutboxJob {
  private readonly logger = new Logger(InstanceCreationOutboxJob.name);

  constructor(
    private readonly outboxEventService: OutboxEventService,
    private readonly dockerContainerService: DockerContainerService,
    private readonly instancesService: InstancesService,
  ) {}

  @OnEvent(INSTANCE_CONSTANT.OUTBOX.CREATION.EVENT)
  public handleEvent(payload: { outboxEventId: string }): void {
    void this.outboxEventService.claimById(payload.outboxEventId, {
      execute: this.execute,
      onFailed: this.onFailed,
      onSuccess: this.onSuccess,
    });
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  public cleanupOrphanedInstances(): void {
    Array.from({ length: 10 }).forEach(() => {
      void this.outboxEventService.claimNext(INSTANCE_CONSTANT.OUTBOX.CREATION.TYPE, {
        execute: this.execute,
        onFailed: this.onFailed,
        onSuccess: this.onSuccess,
      });
    });
  }

  private execute = async (outboxEvent: OutboxEventEntity): Promise<void> => {
    const payload = outboxEvent.payload as unknown as InterfacePayload;
    await setTimeout(5000);
    const { instanceId, containerName, defaultPassword, user } = payload;

    try {
      const image = `${INSTANCE_CONSTANT.REPOSITORY}:${INSTANCE_CONSTANT.VERSION}`;

      const labels = {
        [INSTANCE_CONSTANT.LABEL_VERSION]: INSTANCE_CONSTANT.VERSION,
        [INSTANCE_CONSTANT.LABEL_TYPE]: INSTANCE_CONSTANT.TYPE,
        [INSTANCE_CONSTANT.LABEL_INSTANCE_ID]: instanceId,
        [INSTANCE_CONSTANT.LABEL_MANAGED]: "true",

        "traefik.enable": "true",
        [`traefik.http.routers.${containerName}.rule`]: `Host(\`${instanceId}.${env.INSTANCE_DOMAIN}\`)`,
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

      const exists = await this.dockerContainerService.containerExists(containerName);

      if (exists === false) {
        await this.dockerContainerService.createContainer({
          name: containerName,
          image: image,
          hostConfig,
          networkingConfig,
          labels,
        });
      }

      await this.dockerContainerService.startContainer(containerName);

      await this.createSuperuser(containerName, user.email, defaultPassword);

      await this.instancesService.updateStatus(instanceId, InstanceStatus.COMPLETED);

      this.logger.log(`Container successfully provisioned for instance ${instanceId}`);
    } catch (error) {
      this.logger.error(`Failed to execute instance creation for event ${outboxEvent.id}`, error);

      throw error;
    }
  };

  private onFailed = async (
    outboxEvent: OutboxEventEntity,
    status: OutboxEventStatus.FAILED | OutboxEventStatus.CANCELED,
  ): Promise<void> => {
    this.logger.warn(`Event ${outboxEvent.id} failed with status: ${status}`);

    const payload = outboxEvent.payload as unknown as InterfacePayload;

    const { instanceId, containerName } = payload;

    if (status === OutboxEventStatus.CANCELED) {
      await this.instancesService.updateStatus(instanceId, InstanceStatus.FAILED);

      await this.dockerContainerService.deleteContainer(containerName, true);

      return;
    }

    this.logger.log(`Instance ${instanceId} remains pending for a new attempt.`);
  };

  private onSuccess = (outboxEvent: OutboxEventEntity) => {
    this.logger.log(`Event ${outboxEvent.id} successfully processed.`);
  };

  private async createSuperuser(containerName: string, email: string, password: string): Promise<void> {
    const cmd = ["/pb/pocketbase", "superuser", "upsert", email, password];

    let lastErrorDetails = "";

    for (let attempt = 1; attempt <= INSTANCE_CONSTANT.SUPERUSER_CREATE_ATTEMPTS; attempt++) {
      await setTimeout(INSTANCE_CONSTANT.SUPERUSER_CREATE_RETRY_DELAY_MS);

      try {
        const { running } = await this.dockerContainerService.getContainerStatus(containerName);

        if (running === false) {
          this.logger.warn(`Attempt ${attempt}: Container ${containerName} is not running yet.`);
          continue;
        }

        const { exitCode, stdout, stderr } = await this.dockerContainerService.execContainer(containerName, cmd);

        if (exitCode === 0) {
          this.logger.log(`Superuser created for instance ${containerName}.`, { email });
          return;
        }

        lastErrorDetails = `stdout: ${stdout} | stderr: ${stderr}`;

        this.logger.warn(
          `Superuser upsert failed (exit ${exitCode}) on attempt ${attempt}/${INSTANCE_CONSTANT.SUPERUSER_CREATE_ATTEMPTS} for instance ${containerName}.`,
          { stdout, stderr },
        );
      } catch (error) {
        lastErrorDetails = error instanceof Error ? error.message : String(error);
        this.logger.warn(`Superuser upsert attempt ${attempt} failed for instance ${containerName}.`, error);
      }
    }

    this.logger.error(
      `All ${INSTANCE_CONSTANT.SUPERUSER_CREATE_ATTEMPTS} attempts to create superuser for ${containerName} failed. Last output: ${lastErrorDetails}`,
    );

    throw new InstanceContainerException(ContainerErrorReason.SUPERUSER_CREATE_FAILED);
  }
}
