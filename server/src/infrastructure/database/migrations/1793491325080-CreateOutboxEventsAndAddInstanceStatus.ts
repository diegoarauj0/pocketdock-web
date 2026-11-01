import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOutboxEventsAndAddInstanceStatus1793491325080 implements MigrationInterface {
  name = "CreateOutboxEventsAndAddInstanceStatus1793491325080";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."outbox_events_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'canceled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "outbox_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(128) NOT NULL, "status" "public"."outbox_events_status_enum" NOT NULL DEFAULT 'pending', "payload" jsonb NOT NULL DEFAULT '{}'::jsonb, "attempts" integer NOT NULL DEFAULT '0', "maxAttempts" integer NOT NULL DEFAULT '5', "lastError" text, "completedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6689a16c00d09b8089f6237f1d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_0b7668aa1aed034a544a7ad043" ON "outbox_events"  ("type") `);
    await queryRunner.query(`CREATE INDEX "IDX_e0be43f126ac8af1f654bfccba" ON "outbox_events"  ("type", "status") `);
    await queryRunner.query(`CREATE TYPE "public"."instances_status_enum" AS ENUM('pending', 'completed', 'failed')`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "status" "public"."instances_status_enum" NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."instances_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e0be43f126ac8af1f654bfccba"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0b7668aa1aed034a544a7ad043"`);
    await queryRunner.query(`DROP TABLE "outbox_events"`);
    await queryRunner.query(`DROP TYPE "public"."outbox_events_status_enum"`);
  }
}
