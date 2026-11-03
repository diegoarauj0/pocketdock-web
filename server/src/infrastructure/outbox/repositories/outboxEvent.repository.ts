import { OutboxEventEntity, OutboxEventStatus } from "../outboxEvent.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OutboxEventRepository {
  constructor(
    @InjectRepository(OutboxEventEntity)
    private readonly outboxEventRepository: Repository<OutboxEventEntity>,
    private readonly dataSource: DataSource,
  ) {}

  public create(props: Partial<OutboxEventEntity>): OutboxEventEntity {
    return this.outboxEventRepository.create(props);
  }

  public save(event: OutboxEventEntity): Promise<OutboxEventEntity> {
    return this.outboxEventRepository.save(event);
  }

  public findById(id: string): Promise<OutboxEventEntity | null> {
    return this.outboxEventRepository.findOne({ where: { id: id } });
  }

  public async failed(
    id: string,
    lastError: string,
  ): Promise<{ success: boolean; status: OutboxEventStatus.FAILED | OutboxEventStatus.CANCELED }> {
    const event = (await this.outboxEventRepository.findOneBy({ id: id }))!;

    let status = OutboxEventStatus.FAILED;

    if (event.attempts > event.maxAttempts) {
      status = OutboxEventStatus.CANCELED;
    }

    const result = await this.outboxEventRepository.update(
      { id: id, status: OutboxEventStatus.PROCESSING },
      { status: status, lastError: lastError },
    );

    return { success: result.affected !== 0 && result.affected !== undefined, status: status };
  }

  public async complete(id: string): Promise<{ success: boolean }> {
    const result = await this.outboxEventRepository.update(
      { id: id, status: OutboxEventStatus.PROCESSING },
      { status: OutboxEventStatus.COMPLETED, completedAt: new Date(), lastError: null },
    );

    return { success: result.affected !== 0 && result.affected !== undefined };
  }

  public async claimNext(type: string): Promise<OutboxEventEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const results = await manager.query<OutboxEventEntity[] | undefined>(
        'SELECT * FROM outbox_events WHERE "status" IN ($1, $2) AND "type" = $3 FOR UPDATE SKIP LOCKED LIMIT 1',
        [OutboxEventStatus.PENDING, OutboxEventStatus.FAILED, type],
      );

      const event = (results ?? [])[0];

      if (!event || event.attempts > event.maxAttempts) return null;

      await manager.query(
        'UPDATE "outbox_events" SET "status" = $1, "attempts" = $2, "updatedAt" = NOW() WHERE id = $3',
        [OutboxEventStatus.PROCESSING, event.attempts + 1, event.id],
      );

      event.attempts += 1;
      event.status = OutboxEventStatus.PROCESSING;

      return event;
    });
  }

  public async claimById(id: string): Promise<OutboxEventEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const results = await manager.query<OutboxEventEntity[] | undefined>(
        'SELECT * FROM outbox_events WHERE "id" = $1 AND "status" IN ($2, $3) FOR UPDATE SKIP LOCKED',
        [id, OutboxEventStatus.PENDING, OutboxEventStatus.FAILED],
      );

      const event = (results ?? [])[0];

      if (!event || event.attempts > event.maxAttempts) return null;

      await manager.query(
        'UPDATE "outbox_events" SET "status" = $1, "attempts" = $2, "updatedAt" = NOW() WHERE id = $3',
        [OutboxEventStatus.PROCESSING, event.attempts + 1, id],
      );

      event.attempts += 1;
      event.status = OutboxEventStatus.PROCESSING;

      return event;
    });
  }
}
