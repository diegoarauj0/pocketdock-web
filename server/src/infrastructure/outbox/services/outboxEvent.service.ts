import { OutboxEventRepository } from "../repositories/outboxEvent.repository";
import { OutboxEventEntity, OutboxEventStatus } from "../outboxEvent.entity";
import { Injectable, Logger } from "@nestjs/common";

interface InterfaceCallbacks {
  onSuccess: (outboxEvent: OutboxEventEntity) => void | Promise<void>;
  onFailed: (
    outboxEvent: OutboxEventEntity,
    status: OutboxEventStatus.FAILED | OutboxEventStatus.CANCELED,
  ) => void | Promise<void>;
  execute: (outboxEvent: OutboxEventEntity) => void | Promise<void>;
}

@Injectable()
export class OutboxEventService {
  private readonly logger = new Logger(OutboxEventService.name);

  constructor(private readonly outboxEventRepository: OutboxEventRepository) {}

  public create(props: Partial<OutboxEventEntity>): OutboxEventEntity {
    return this.outboxEventRepository.create(props);
  }

  public save(event: OutboxEventEntity): Promise<OutboxEventEntity> {
    return this.outboxEventRepository.save(event);
  }

  public async claimNext(type: string, callbacks: InterfaceCallbacks): Promise<void> {
    const outboxEvent = await this.outboxEventRepository.claimNext(type);

    if (outboxEvent === null) return;

    return this.handleClaim(outboxEvent, callbacks);
  }

  public async claimById(id: string, callbacks: InterfaceCallbacks): Promise<void> {
    const outboxEvent = await this.outboxEventRepository.claimById(id);

    if (outboxEvent === null) return;

    return this.handleClaim(outboxEvent, callbacks);
  }

  private async handleClaim(outboxEvent: OutboxEventEntity, callbacks: InterfaceCallbacks): Promise<void> {
    const { execute, onFailed, onSuccess } = callbacks;

    try {
      await execute(outboxEvent);
    } catch (error) {
      this.logger.error("Failed to outboxEvent.", { id: outboxEvent.id, type: outboxEvent.type });
      this.logger.error(error);

      const { status } = await this.outboxEventRepository.failed(outboxEvent.id, String(error));

      return onFailed(outboxEvent, status);
    }

    await this.outboxEventRepository.complete(outboxEvent.id);

    return onSuccess(outboxEvent);
  }
}
