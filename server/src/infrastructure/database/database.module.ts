import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import config from "./config";

@Module({
  imports: [TypeOrmModule.forRoot(config)],
})
export class DatabaseModule {}
