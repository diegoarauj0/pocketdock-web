import { EventEntity } from "./event.entity";
import { InjectRepository } from "@nestjs/typeorm";
import type { InterfaceEventPayloadBase } from "./event.constant";
import { EventStatus } from "./event.constant";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

interface InterfaceEventRow {
  id: string;
  type: string;
  status: EventStatus;
  payload: InterfaceEventPayloadBase | null;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly dataSource: DataSource,
  ) {}

  public async claimAndUpdatePending(type: string, limit: number): Promise<EventEntity[]> {
    return this.dataSource.transaction(async (manager) => {
      const rows = await manager.query<InterfaceEventRow[]>(
        `SELECT "id"
         FROM "events"
         WHERE "type" = $1 AND "status" = $2
         ORDER BY "createdAt"
         LIMIT $3
         FOR UPDATE SKIP LOCKED`,
        [type, EventStatus.PENDING, limit],
      );

      if (rows.length === 0) {
        return [];
      }

      const ids = rows.map((row) => row.id);

      const [updatedRows] = await manager.query<[InterfaceEventRow[], number]>(
        `UPDATE "events"
         SET "status" = $1, "startedAt" = now(), "attempts" = "attempts" + 1
         WHERE "id" = ANY($2::uuid[])
         RETURNING "id", "type", "status", "payload", "attempts", "maxAttempts", "lastError", "createdAt", "startedAt", "completedAt"`,
        [EventStatus.PROCESSING, ids],
      );

      return updatedRows.map((row) => this.eventRepository.create(row));
    });
  }

  public async recoverOrphaned(type: string): Promise<number> {
    const [rows] = await this.dataSource.query<[InterfaceEventRow[], number]>(
      `UPDATE "events"
       SET "status" = $1, "startedAt" = NULL
       WHERE "type" = $2 AND "status" = $3
       RETURNING "id"`,
      [EventStatus.PENDING, type, EventStatus.PROCESSING],
    );

    return rows.length;
  }

  public create(props: Partial<EventEntity>): EventEntity {
    return this.eventRepository.create(props);
  }

  public save(event: EventEntity): Promise<EventEntity> {
    return this.eventRepository.save(event);
  }
}
