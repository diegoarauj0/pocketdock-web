import { InstanceCreationOutboxJob } from "./jobs/instanceCreationOutbox.job";
import { InstanceRemovalOutboxJob } from "./jobs/instanceRemovalOutbox.job";
import { InstanceRepository } from "./repositories/instance.repository";
import { InstancesController } from "./controllers/instances.controller";
import { DockerModule } from "src/infrastructure/docker/docker.module";
import { InstancesService } from "./services/instances.service";
import { CommonModule } from "src/common/common.module";
import { OutboxModule } from "src/infrastructure/outbox/outbox.module";
import { LockModule } from "src/infrastructure/lock/lock.module";
import { InstanceEntity } from "./instance.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [CommonModule, DockerModule, OutboxModule, LockModule, TypeOrmModule.forFeature([InstanceEntity])],
  providers: [InstancesService, InstanceCreationOutboxJob, InstanceRemovalOutboxJob, InstanceRepository],
  controllers: [InstancesController],
  exports: [InstancesService],
})
export class InstanceModule {}
