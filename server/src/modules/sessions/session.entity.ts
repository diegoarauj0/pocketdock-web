import { UserEntity } from "src/modules/users/user.entity";
import * as typeorm from "typeorm";

export enum SessionRevokeType {
  TOKEN_REUSE = "TOKEN_REUSE",
  LOGOUT_ALL = "LOGOUT_ALL",
  EXPIRED = "EXPIRED",
  LOGOUT = "LOGOUT",
}

@typeorm.Entity("sessions")
export class SessionEntity {
  @typeorm.PrimaryColumn({ generated: "uuid", unique: true, type: "uuid" })
  public ID!: string;

  @typeorm.ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @typeorm.JoinColumn({ name: "userID" })
  public user!: UserEntity;

  @typeorm.Index()
  @typeorm.Column({ type: "uuid", nullable: false })
  public userID!: string;

  @typeorm.Column({ type: "varchar", length: 255, nullable: false })
  public refreshTokenHash!: string;

  @typeorm.Column({ type: "timestamp", nullable: false })
  public expiresAt!: Date;

  @typeorm.Column({ type: "boolean", default: false, nullable: false })
  public revoked!: boolean;

  @typeorm.Column({ type: "timestamp", nullable: true })
  public revokedAt!: Date | null;

  @typeorm.Column({ type: "enum", enum: SessionRevokeType, nullable: true })
  public revokeType!: SessionRevokeType | null;

  @typeorm.Column({ type: "inet", nullable: true })
  public ipAddress!: string | null;

  @typeorm.Column({ type: "varchar", length: 255, nullable: true })
  public userAgent!: string | null;

  @typeorm.CreateDateColumn()
  public createdAt!: Date;

  @typeorm.UpdateDateColumn()
  public updatedAt!: Date;
}
