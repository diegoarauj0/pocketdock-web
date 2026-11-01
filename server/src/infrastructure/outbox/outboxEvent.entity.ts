import * as typeorm from "typeorm";

export enum OutboxEventStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELED = "canceled",
}

@typeorm.Index(["type", "status"])
@typeorm.Entity("outbox_events")
export class OutboxEventEntity {
  @typeorm.PrimaryColumn({ generated: "uuid", unique: true, type: "uuid" })
  public id!: string;

  @typeorm.Index()
  @typeorm.Column({ type: "varchar", length: 128, nullable: false })
  public type!: string;

  @typeorm.Column({
    type: "enum",
    enum: OutboxEventStatus,
    default: OutboxEventStatus.PENDING,
    nullable: false,
  })
  public status!: OutboxEventStatus;

  @typeorm.Column({ type: "jsonb", default: () => "'{}'::jsonb", nullable: false })
  public payload!: Record<string, unknown>;

  @typeorm.Column({ type: "integer", default: 0, nullable: false })
  public attempts!: number;

  @typeorm.Column({ type: "integer", default: 5, nullable: false })
  public maxAttempts!: number;

  @typeorm.Column({ type: "text", nullable: true })
  public lastError!: string | null;

  @typeorm.Column({ type: "timestamptz", nullable: true })
  public completedAt!: Date | null;

  @typeorm.CreateDateColumn({ type: "timestamptz" })
  public createdAt!: Date;

  @typeorm.UpdateDateColumn({ type: "timestamptz" })
  public updatedAt!: Date;
}
