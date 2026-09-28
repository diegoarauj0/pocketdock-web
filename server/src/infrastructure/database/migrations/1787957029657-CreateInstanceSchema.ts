import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInstanceSchema1787957029657 implements MigrationInterface {
  name = "CreateInstanceSchema1787957029657";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "instances" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "userID" uuid NOT NULL, "containerName" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6e2ac0644e57eb052855f6430b" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_37eeb3ee228dd1bbcbca9b0ebf" ON "instances"  ("containerName") `);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_8376fce71f36dc0b8146919b2a7" FOREIGN KEY ("userID") REFERENCES "users"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" DROP CONSTRAINT "FK_8376fce71f36dc0b8146919b2a7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_37eeb3ee228dd1bbcbca9b0ebf"`);
    await queryRunner.query(`DROP TABLE "instances"`);
  }
}
