import { InstanceRepository } from "./repositories/instance.repository";
import { InstanceController } from "./controllers/instance.controller";
import { DockerModule } from "src/infrastructure/docker/docker.module";
import { InstanceService } from "./services/instance.service";
import { CommonModule } from "src/common/common.module";
import { InstanceEntity } from "./instance.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [CommonModule, DockerModule, TypeOrmModule.forFeature([InstanceEntity])],
  providers: [InstanceService, InstanceRepository],
  controllers: [InstanceController],
  exports: [],
})
export class InstanceModule {}
