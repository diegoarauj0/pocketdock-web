import { InstanceCleanupJob } from "./jobs/instanceCleanup.job";
import { InstanceRepository } from "./repositories/instance.repository";
import { InstancesController } from "./controllers/instances.controller";
import { DockerModule } from "src/infrastructure/docker/docker.module";
import { InstancesService } from "./services/instances.service";
import { CommonModule } from "src/common/common.module";
import { InstanceEntity } from "./instance.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [CommonModule, DockerModule, TypeOrmModule.forFeature([InstanceEntity])],
  providers: [InstancesService, InstanceCleanupJob, InstanceRepository],
  controllers: [InstancesController],
  exports: [InstancesService],
})
export class InstanceModule {}
