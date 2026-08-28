import { DockerImageService } from "./dockerImage.service";
import { DOCKER_CONSTANT } from "../docker.constant";
import { Injectable, Logger } from "@nestjs/common";
import { DockerService } from "./docker.service";

@Injectable()
export class DockerProvisionerService {
  private readonly logger = new Logger(DockerProvisionerService.name);

  constructor(
    private readonly dockerService: DockerService,
    private readonly dockerImageService: DockerImageService,
  ) {}

  public async provision(): Promise<void> {
    this.logger.log("Starting Docker provisioning...");

    await this.ensureDockerAvailable();
    await this.ensureRequiredImages();

    this.logger.log("Docker provisioning completed.");
  }

  private async ensureDockerAvailable(): Promise<void> {
    this.logger.debug("Checking Docker connection...");

    await this.dockerService.ping();

    this.logger.debug("Docker connection is available.");
  }

  private async ensureRequiredImages(): Promise<void> {
    await this.ensurePocketBaseImage();
  }

  private async ensurePocketBaseImage(): Promise<void> {
    const image = `${DOCKER_CONSTANT.POCKETBASE_REPOSITORY}:${DOCKER_CONSTANT.POCKETBASE_VERSION}`;

    this.logger.debug(`Checking image "${image}"...`);

    const exists = await this.dockerImageService.imageExists(image);

    if (exists) {
      this.logger.debug(`Image "${image}" already exists.`);
      return;
    }

    this.logger.log(`Image "${image}" does not exist. Building...`);

    await this.dockerImageService.buildImage({
      context: DOCKER_CONSTANT.POCKETBASE_CONTEXT,
      dockerfile: DOCKER_CONSTANT.POCKETBASE_DOCKERFILE,
      tag: image,
      labels: {
        [DOCKER_CONSTANT.POCKETBASE_LABEL_MANAGED]: "true",
        [DOCKER_CONSTANT.POCKETBASE_LABEL_TYPE]: DOCKER_CONSTANT.POCKETBASE_TYPE,
        [DOCKER_CONSTANT.POCKETBASE_LABEL_VERSION]: DOCKER_CONSTANT.POCKETBASE_VERSION,
      },
      buildArgs: {
        POCKETBASE_VERSION: DOCKER_CONSTANT.POCKETBASE_VERSION,
      },
    });

    this.logger.log(`Image "${image}" successfully built.`);
  }
}
