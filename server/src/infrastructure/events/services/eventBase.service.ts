import { EVENT_CONSTANT, EventStatus, InterfaceEventPayloadBase } from "../event.constant";
import { EventRepository } from "../event.repository";
import { Injectable, Logger } from "@nestjs/common";
import { EventEntity } from "../event.entity";
import { EntityManager } from "typeorm";

@Injectable()
export abstract class EventBase<InterfacePayload extends InterfaceEventPayloadBase = InterfaceEventPayloadBase> {
  protected readonly logger = new Logger(this.constructor.name);

  protected abstract readonly type: string;

  protected constructor(protected readonly eventRepository: EventRepository) {}

  public async enqueue(manager: EntityManager, payload: InterfacePayload): Promise<EventEntity> {
    const event = this.eventRepository.create({
      type: this.type,
      status: EventStatus.PENDING,
      payload,
      attempts: 0,
    });

    return manager.save(event);
  }

  public async process(limit: number = EVENT_CONSTANT.POLLING_BATCH_SIZE): Promise<void> {
    const events = await this.eventRepository.claimAndUpdatePending(this.type, limit);

    for (const event of events) {
      try {
        await this.execute(event.payload as InterfacePayload, event);

        event.status = EventStatus.COMPLETED;
        event.completedAt = new Date();

        await this.eventRepository.save(event);
      } catch (error) {
        this.logger.error(`Failed to process event "${this.type}" (${event.id}).`, error);

        event.lastError = error instanceof Error ? error.message : String(error);
        event.status = event.attempts >= event.maxAttempts ? EventStatus.FAILED : EventStatus.PENDING;

        await this.eventRepository.save(event);
      }
    }
  }

  public async reconcile(): Promise<void> {
    const affected = await this.eventRepository.recoverOrphaned(this.type);

    if (affected > 0) {
      this.logger.log(`Recovered ${affected} orphaned "${this.type}" event(s).`);
    }
  }

  protected abstract execute(payload: InterfacePayload, event: EventEntity): Promise<void>;
}
