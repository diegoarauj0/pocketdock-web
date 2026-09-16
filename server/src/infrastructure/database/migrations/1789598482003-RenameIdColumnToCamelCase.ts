import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameIdColumnToCamelCase1789598482003 implements MigrationInterface {
  name = "RenameIdColumnToCamelCase1789598482003";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_d9505e1f0b2046b764ad4a6c1ac"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP CONSTRAINT "FK_e0b15c5caa43c92b2f46f94a04c"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_faaaef375314a0c1673cebe5408"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP CONSTRAINT "FK_8376fce71f36dc0b8146919b2a7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_faaaef375314a0c1673cebe540"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "ID" TO "id"`);
    await queryRunner.query(
      `ALTER TABLE "users" RENAME CONSTRAINT "PK_5763954075431ddd0821cd906da" TO "PK_a3ffb1c0c8416b9fc6f907b7433"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "PK_54b3857538e66be4738ef5a5889"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "ID"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "userID"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP CONSTRAINT "PK_7c660f8c292f1ccc0ad2ed8c21b"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP COLUMN "ID"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP COLUMN "userID"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "PK_58fbdaa7d8a251f5b092d5df277"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "ID"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "userID"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP CONSTRAINT "PK_e6e2ac0644e57eb052855f6430b"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "ID"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "userID"`);
    await queryRunner.query(`ALTER TABLE "accounts" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "emailverifications" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "emailverifications" ADD CONSTRAINT "PK_aa461f85ec5ffff89d40a522b2e" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "emailverifications" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sessions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "instances" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "PK_11862209053330b4765f7f54178" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "instances" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "instances" ALTER COLUMN "defaultPassword" DROP DEFAULT`);
    await queryRunner.query(`CREATE INDEX "IDX_57de40bc620f456c7311aa3a1e" ON "sessions"  ("userId") `);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emailverifications" ADD CONSTRAINT "FK_bae2844479f4bcdcb2dfc49076d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_f7e5fa09167670de7a2a0952f53" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" DROP CONSTRAINT "FK_f7e5fa09167670de7a2a0952f53"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP CONSTRAINT "FK_bae2844479f4bcdcb2dfc49076d"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_57de40bc620f456c7311aa3a1e"`);
    await queryRunner.query(`ALTER TABLE "instances" ALTER COLUMN "defaultPassword" SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP CONSTRAINT "PK_11862209053330b4765f7f54178"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "PK_3238ef96f18b355b671619111bc"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP CONSTRAINT "PK_aa461f85ec5ffff89d40a522b2e"`);
    await queryRunner.query(`ALTER TABLE "emailverifications" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "PK_5a7a02c20412299d198e097a8fe"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "instances" ADD "userID" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "instances" ADD "ID" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "PK_e6e2ac0644e57eb052855f6430b" PRIMARY KEY ("ID")`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" ADD "userID" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sessions" ADD "ID" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "PK_58fbdaa7d8a251f5b092d5df277" PRIMARY KEY ("ID")`,
    );
    await queryRunner.query(`ALTER TABLE "emailverifications" ADD "userID" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "emailverifications" ADD "ID" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "emailverifications" ADD CONSTRAINT "PK_7c660f8c292f1ccc0ad2ed8c21b" PRIMARY KEY ("ID")`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" ADD "userID" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "accounts" ADD "ID" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "PK_54b3857538e66be4738ef5a5889" PRIMARY KEY ("ID")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" TO "PK_5763954075431ddd0821cd906da"`,
    );
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "id" TO "ID"`);
    await queryRunner.query(`CREATE INDEX "IDX_faaaef375314a0c1673cebe540" ON "sessions" USING btree ("userID") `);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_8376fce71f36dc0b8146919b2a7" FOREIGN KEY ("userID") REFERENCES "users"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_faaaef375314a0c1673cebe5408" FOREIGN KEY ("userID") REFERENCES "users"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "emailverifications" ADD CONSTRAINT "FK_e0b15c5caa43c92b2f46f94a04c" FOREIGN KEY ("userID") REFERENCES "users"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_d9505e1f0b2046b764ad4a6c1ac" FOREIGN KEY ("userID") REFERENCES "users"("ID") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
