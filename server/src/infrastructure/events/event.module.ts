import { EventRepository } from "./event.repository";
import { EventEntity } from "./event.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventRepository],
  exports: [EventRepository],
})
export class EventModule {}
