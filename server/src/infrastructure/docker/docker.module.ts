import { DockerProvisionerService } from "./services/dockerProvisioner.service";
import { DockerContainerService } from "./services/dockerContainer.service";
import { DockerNetworkService } from "./services/dockerNetwork.service";
import { DockerImageService } from "./services/dockerImage.service";
import { DockerService } from "./services/docker.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    DockerService,
    DockerContainerService,
    DockerImageService,
    DockerNetworkService,
    DockerProvisionerService,
  ],
  exports: [DockerContainerService],
})
export class DockerModule {}
