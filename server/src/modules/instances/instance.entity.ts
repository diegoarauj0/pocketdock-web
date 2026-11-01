import { UserEntity } from "src/modules/users/user.entity";
import * as typeorm from "typeorm";

export enum InstanceStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

@typeorm.Entity("instances")
export class InstanceEntity {
  @typeorm.PrimaryColumn({ generated: "uuid", unique: true, type: "uuid" })
  public id!: string;

  @typeorm.Column({ type: "uuid", nullable: false })
  public userId!: UserEntity["id"];

  @typeorm.ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @typeorm.JoinColumn({ name: "userId" })
  public user!: UserEntity;

  @typeorm.Column({
    type: "enum",
    enum: InstanceStatus,
    default: InstanceStatus.PENDING,
    nullable: false,
  })
  public status!: InstanceStatus;

  @typeorm.Index()
  @typeorm.Column({ type: "varchar", length: 255, nullable: false })
  public containerName!: string;

  @typeorm.Column({ type: "varchar", length: 255, nullable: false })
  public defaultPassword!: string;

  @typeorm.CreateDateColumn()
  public createdAt!: Date;

  @typeorm.UpdateDateColumn()
  public updatedAt!: Date;
}
