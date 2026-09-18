import { EVENT_CONSTANT, EventStatus } from "./event.constant";
import type { InterfaceEventPayloadBase } from "./event.constant";
import * as TypeORM from "typeorm";

@TypeORM.Entity("events")
export class EventEntity {
  @TypeORM.PrimaryColumn({ generated: "uuid", type: "uuid" })
  public id!: string;

  @TypeORM.Column({ type: "varchar", length: 100 })
  public type!: string;

  @TypeORM.Column({ type: "varchar", length: 20 })
  public status!: EventStatus;

  @TypeORM.Column({ type: "jsonb", nullable: true })
  public payload!: InterfaceEventPayloadBase | null;

  @TypeORM.Column({ type: "int", default: 0 })
  public attempts!: number;

  @TypeORM.Column({ type: "int", default: EVENT_CONSTANT.MAX_ATTEMPTS })
  public maxAttempts!: number;

  @TypeORM.Column({ type: "text", nullable: true })
  public lastError?: string | null;

  @TypeORM.CreateDateColumn()
  public createdAt!: Date;

  @TypeORM.Index()
  @TypeORM.Column({ type: "timestamp", nullable: true })
  public startedAt?: Date | null;

  @TypeORM.Column({ type: "timestamp", nullable: true })
  public completedAt?: Date | null;
}
