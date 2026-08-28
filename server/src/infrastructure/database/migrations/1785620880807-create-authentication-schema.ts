import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuthenticationSchema1785620880807 implements MigrationInterface {
  name = "CreateAuthenticationSchema1785620880807";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(16) NOT NULL, "email" character varying(255) NOT NULL, "hash" character varying(255), "emailVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5763954075431ddd0821cd906da" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users"  ("email") `);
    await queryRunner.query(`CREATE TYPE "public"."accounts_provider_enum" AS ENUM('google')`);
    await queryRunner.query(
      `CREATE TABLE "accounts" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "userID" uuid NOT NULL, "provider" "public"."accounts_provider_enum" NOT NULL, "providerAccountID" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fadc2c2c6ec5cf98c4c26856b6f" UNIQUE ("provider", "providerAccountID"), CONSTRAINT "PK_54b3857538e66be4738ef5a5889" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."emailverifications_type_enum" AS ENUM('FORGOT_PASSWORD', 'SIGN_UP')`,
    );
    await queryRunner.query(
      `CREATE TABLE "emailverifications" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "userID" uuid NOT NULL, "email" character varying(255) NOT NULL, "payload" jsonb, "type" "public"."emailverifications_type_enum" NOT NULL, "hash" character varying(255) NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7c660f8c292f1ccc0ad2ed8c21b" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_unique_active_email_verification" ON "emailverifications"  ("email", "type") WHERE "revoked" = false`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sessions_revoketype_enum" AS ENUM('TOKEN_REUSE', 'LOGOUT_ALL', 'EXPIRED', 'LOGOUT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "userID" uuid NOT NULL, "refreshTokenHash" character varying(255) NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "revokedAt" TIMESTAMP, "revokeType" "public"."sessions_revoketype_enum", "ipAddress" inet, "userAgent" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_58fbdaa7d8a251f5b092d5df277" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_faaaef375314a0c1673cebe540" ON "sessions"  ("userID") `);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_d9505e1f0b2046b764ad4a6c1ac" FOREIGN KEY ("userID") REFERENCES "users"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emailverifications" ADD CONSTRAINT "FK_e0b15c5caa43c92b2f46f94a04c" FOREIGN KEY ("userID") REFERENCES "users"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_faaaef375314a0c1673cebe5408" FOREIGN KEY ("userID") REFERENCES "users"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_faaaef375314a0c1673cebe5408"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP CONSTRAINT "FK_e0b15c5caa43c92b2f46f94a04c"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_d9505e1f0b2046b764ad4a6c1ac"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_faaaef375314a0c1673cebe540"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TYPE "public"."sessions_revoketype_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_unique_active_email_verification"`);
    await queryRunner.query(`DROP TABLE "emailverifications"`);
    await queryRunner.query(`DROP TYPE "public"."emailverifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TYPE "public"."accounts_provider_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
