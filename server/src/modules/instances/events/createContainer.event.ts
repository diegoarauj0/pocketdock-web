import { ContainerErrorReason, InstanceContainerException } from "../exceptions/instanceContainer.exception";
import { DockerContainerService } from "src/infrastructure/docker/services/dockerContainer.service";
import { InterfaceEventPayloadBase } from "src/infrastructure/events/event.constant";
import { EventBase } from "src/infrastructure/events/services/eventBase.service";
import { EventRepository } from "src/infrastructure/events/event.repository";
import { EventHandler } from "src/infrastructure/events/event.decorator";
import { isAlreadyRunning } from "src/infrastructure/docker/docker.util";
import { INSTANCE_CONSTANT } from "../instance.constant";
import { setTimeout } from "node:timers/promises";
import { Injectable } from "@nestjs/common";
import { env } from "src/config/env";

export interface InterfaceCreateContainerEventPayload extends InterfaceEventPayloadBase {
  defaultPassword: string;
  containerName: string;
  instanceId: string;
  email: string;
}

@EventHandler()
@Injectable()
export class CreateContainerEvent extends EventBase<InterfaceCreateContainerEventPayload> {
  protected readonly type = "CREATE_CONTAINER";

  constructor(
    eventRepository: EventRepository,
    private readonly dockerContainerService: DockerContainerService,
  ) {
    super(eventRepository);
  }

  protected async execute(payload: InterfaceCreateContainerEventPayload): Promise<void> {
    await this.createContainer(payload);

    await this.startContainer(payload.containerName);
    //await this.createSuperuser(payload.containerName, payload.email, payload.defaultPassword);
  }

  private async startContainer(containerName: string): Promise<void> {
    await this.dockerContainerService.startContainer(containerName);
  }

  private async createContainer(payload: InterfaceCreateContainerEventPayload): Promise<void> {
    const { instanceId, containerName } = payload;

    const created = await this.dockerContainerService.containerExists(containerName);

    if (created) return;

    const image = `${INSTANCE_CONSTANT.REPOSITORY}:${INSTANCE_CONSTANT.VERSION}`;

    const labels = {
      [INSTANCE_CONSTANT.LABEL_VERSION]: INSTANCE_CONSTANT.VERSION,
      [INSTANCE_CONSTANT.LABEL_TYPE]: INSTANCE_CONSTANT.TYPE,
      [INSTANCE_CONSTANT.LABEL_MANAGED]: "true",
      [INSTANCE_CONSTANT.LABEL_INSTANCE_ID]: instanceId,

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

    await this.dockerContainerService.createContainer({
      name: containerName,
      image,
      hostConfig,
      networkingConfig,
      labels,
    });
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
