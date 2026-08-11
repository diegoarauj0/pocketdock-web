import { env } from "src/config/env";
import { DataSourceOptions } from "typeorm";

export default {
  type: "postgres",
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  migrationsRun: true,
  logging: ["error", "warn", "migration"],
  synchronize: false,
  entities: ["dist/**/*.entity.{js,ts}"],
  migrations: ["dist/modules/database/migrations/*.js"],
} as DataSourceOptions;
