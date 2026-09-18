import { DockerContainerService } from "src/infrastructure/docker/services/dockerContainer.service";
import { InterfaceEventPayloadBase } from "src/infrastructure/events/event.constant";
import { EventBase } from "src/infrastructure/events/services/eventBase.service";
import { EventRepository } from "src/infrastructure/events/event.repository";
import { EventHandler } from "src/infrastructure/events/event.decorator";
import { Injectable } from "@nestjs/common";

export interface InterfaceDeleteContainerEventPayload extends InterfaceEventPayloadBase {
  containerName: string;
}

@EventHandler()
@Injectable()
export class DeleteContainerEvent extends EventBase<InterfaceDeleteContainerEventPayload> {
  protected readonly type = "DELETE_CONTAINER";

  constructor(
    eventRepository: EventRepository,
    private readonly dockerContainerService: DockerContainerService,
  ) {
    super(eventRepository);
  }

  protected async execute(payload: InterfaceDeleteContainerEventPayload): Promise<void> {
    const { containerName } = payload;

    await this.dockerContainerService.deleteContainer(containerName, true);
  }
}
