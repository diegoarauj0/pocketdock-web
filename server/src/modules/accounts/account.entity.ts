import { UserEntity } from "src/modules/users/user.entity";
import * as typeorm from "typeorm";

export enum AccountProvider {
  GOOGLE = "google",
}

@typeorm.Entity("accounts")
@typeorm.Unique(["provider", "providerAccountID"])
export class AccountEntity {
  @typeorm.PrimaryColumn({ type: "uuid", generated: "uuid", nullable: false })
  public ID!: string;

  @typeorm.Column({ type: "uuid", nullable: false })
  public userID!: string;

  @typeorm.ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @typeorm.JoinColumn({ name: "userID" })
  public user!: UserEntity;

  @typeorm.Column({ type: "enum", enum: AccountProvider, nullable: false })
  public provider!: AccountProvider;

  @typeorm.Column({ type: "varchar", length: 255, nullable: false })
  public providerAccountID!: string;

  @typeorm.CreateDateColumn()
  public createdAt!: Date;

  @typeorm.UpdateDateColumn()
  public updatedAt!: Date;
}
