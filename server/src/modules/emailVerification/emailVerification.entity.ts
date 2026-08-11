import { UserEntity } from "src/modules/users/user.entity";
import * as typeorm from "typeorm";

export enum EmailVerificationType {
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  SIGN_UP = "SIGN_UP",
}

@typeorm.Entity({ name: "emailverifications" })
@typeorm.Index("IDX_unique_active_email_verification", ["email", "type"], { unique: true, where: '"revoked" = false' })
export class EmailVerificationEntity {
  @typeorm.PrimaryColumn({ generated: "uuid", unique: true, type: "uuid" })
  public ID!: string;

  @typeorm.Column({ type: "uuid", nullable: false })
  public userID!: UserEntity["ID"];

  @typeorm.Column({ type: "varchar", length: 255, nullable: false })
  public email!: UserEntity["email"];

  @typeorm.Column({ type: "jsonb", nullable: true })
  public payload!: Record<string, unknown> | true;

  @typeorm.ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @typeorm.JoinColumn({ name: "userID" })
  public user!: UserEntity;

  @typeorm.Column({ type: "enum", enum: EmailVerificationType, nullable: false })
  public type!: EmailVerificationType;

  @typeorm.Column({ type: "varchar", length: 255, nullable: false })
  public hash!: string;

  @typeorm.Column({ type: "boolean", default: false, nullable: false })
  public revoked!: boolean;

  @typeorm.Column({ type: "timestamp", nullable: false })
  public expiresAt!: Date;

  @typeorm.CreateDateColumn()
  public createdAt!: Date;

  @typeorm.UpdateDateColumn()
  public updatedAt!: Date;
}
