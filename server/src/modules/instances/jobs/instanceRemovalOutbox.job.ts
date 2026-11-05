import { DockerContainerService } from "src/infrastructure/docker/services/dockerContainer.service";
import { OutboxEventEntity, OutboxEventStatus } from "src/infrastructure/outbox/outboxEvent.entity";
import { OutboxEventService } from "src/infrastructure/outbox/services/outboxEvent.service";
import { INSTANCE_CONSTANT } from "../instance.constant";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

interface InterfacePayload {
  instanceId: string;
  containerName: string;
}

@Injectable()
export class InstanceRemovalOutboxJob {
  private readonly logger = new Logger(InstanceRemovalOutboxJob.name);

  constructor(
    private readonly outboxEventService: OutboxEventService,
    private readonly dockerContainerService: DockerContainerService,
  ) {}

  @OnEvent(INSTANCE_CONSTANT.OUTBOX.REMOVAL.EVENT)
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
      void this.outboxEventService.claimNext(INSTANCE_CONSTANT.OUTBOX.REMOVAL.TYPE, {
        execute: this.execute,
        onFailed: this.onFailed,
        onSuccess: this.onSuccess,
      });
    });
  }

  private execute = async (outboxEvent: OutboxEventEntity): Promise<void> => {
    const { instanceId, containerName } = outboxEvent.payload as unknown as InterfacePayload;

    try {
      await this.dockerContainerService.deleteContainer(containerName, true);

      this.logger.log(`Container successfully removed for instance ${instanceId}`);
    } catch (error) {
      this.logger.error(`Failed to execute instance removal for event ${outboxEvent.id}`, error);

      throw error;
    }
  };

  private onFailed = (
    outboxEvent: OutboxEventEntity,
    status: OutboxEventStatus.FAILED | OutboxEventStatus.CANCELED,
  ): void => {
    const { instanceId, containerName } = outboxEvent.payload as unknown as InterfacePayload;

    if (status === OutboxEventStatus.CANCELED) {
      this.logger.error(
        `Event ${outboxEvent.id} canceled. Container ${containerName} of instance ${instanceId} was not removed.`,
      );

      return;
    }

    this.logger.warn(`Event ${outboxEvent.id} failed with status: ${status}. Container ${containerName} remains.`);
  };

  private onSuccess = (outboxEvent: OutboxEventEntity): void => {
    this.logger.log(`Event ${outboxEvent.id} successfully processed.`);
  };
}
