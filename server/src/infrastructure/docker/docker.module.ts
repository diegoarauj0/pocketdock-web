import { DockerProvisionerService } from "./services/dockerProvisioner.service";
import { DockerContainerService } from "./services/dockerContainer.service";
import { DockerVolumeService } from "./services/dockerVolume.service";
import { DockerImageService } from "./services/dockerImage.service";
import { DockerService } from "./services/docker.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [DockerService, DockerContainerService, DockerImageService, DockerProvisionerService, DockerVolumeService],
})
export class DockerModule {}
