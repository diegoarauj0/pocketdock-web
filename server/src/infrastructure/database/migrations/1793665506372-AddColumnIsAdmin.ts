import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsAdmin1793665506372 implements MigrationInterface {
  name = "AddColumnIsAdmin1793665506372";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "outbox_events" ALTER COLUMN "payload" SET DEFAULT '{}'::jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "outbox_events" ALTER COLUMN "payload" SET DEFAULT '{}'`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
  }
}
