import { Column, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { CreateDateColumn } from "typeorm/browser";
import { USER_CONSTANT } from "./user.constant";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryColumn({ generated: "uuid", unique: true, type: "uuid" })
  public id!: string;

  @Column({ type: "varchar", length: USER_CONSTANT.USERNAME_MAX_LENGTH, nullable: false })
  public username!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 255, nullable: false })
  public email!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  public hash?: string | null;

  @Column({ type: "boolean", default: false })
  public emailVerified!: boolean;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
