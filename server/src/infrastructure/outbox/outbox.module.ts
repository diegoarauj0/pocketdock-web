import { OutboxEventRepository } from "./repositories/outboxEvent.repository";
import { OutboxEventService } from "./services/outboxEvent.service";
import { OutboxEventEntity } from "./outboxEvent.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([OutboxEventEntity])],
  providers: [OutboxEventRepository, OutboxEventService],
  exports: [OutboxEventService],
})
export class OutboxModule {}
