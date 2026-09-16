import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultPasswordToInstanceSchema1789657029657 implements MigrationInterface {
  name = "AddDefaultPasswordToInstanceSchema1789657029657";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" ADD "defaultPassword" character varying(255) NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "defaultPassword"`);
  }
}
