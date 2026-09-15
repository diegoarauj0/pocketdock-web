import { UserEntity } from "src/modules/users/user.entity";
import * as typeorm from "typeorm";

@typeorm.Entity("instances")
export class InstanceEntity {
  @typeorm.PrimaryColumn({ generated: "uuid", unique: true, type: "uuid" })
  public ID!: string;

  @typeorm.Column({ type: "uuid", nullable: false })
  public userID!: UserEntity["ID"];

  @typeorm.ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @typeorm.JoinColumn({ name: "userID" })
  public user!: UserEntity;

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
