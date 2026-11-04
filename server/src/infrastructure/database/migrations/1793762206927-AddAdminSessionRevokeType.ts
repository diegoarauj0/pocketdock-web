import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminSessionRevokeType1793762206927 implements MigrationInterface {
  name = "AddAdminSessionRevokeType1793762206927";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "outbox_events" ALTER COLUMN "payload" SET DEFAULT '{}'::jsonb`);
    await queryRunner.query(`ALTER TYPE "public"."sessions_revoketype_enum" ADD VALUE 'ADMIN'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."sessions_revoketype_enum_old" AS ENUM('TOKEN_REUSE', 'LOGOUT_ALL', 'EXPIRED', 'LOGOUT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ALTER COLUMN "revokeType" TYPE "public"."sessions_revoketype_enum_old" USING "revokeType"::"text"::"public"."sessions_revoketype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."sessions_revoketype_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."sessions_revoketype_enum_old" RENAME TO "sessions_revoketype_enum"`);
    await queryRunner.query(`ALTER TABLE "outbox_events" ALTER COLUMN "payload" SET DEFAULT '{}'`);
  }
}
