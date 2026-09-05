import { INSTANCE_CONSTANT } from "src/modules/instances/instance.constant";
import { DockerImageService } from "./dockerImage.service";
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
    const image = `${INSTANCE_CONSTANT.REPOSITORY}:${INSTANCE_CONSTANT.VERSION}`;

    this.logger.debug(`Checking image "${image}"...`);

    const exists = await this.dockerImageService.imageExists(image);

    if (exists) {
      this.logger.debug(`Image "${image}" already exists.`);
      return;
    }

    this.logger.log(`Image "${image}" does not exist. Building...`);

    await this.dockerImageService.buildImage({
      context: INSTANCE_CONSTANT.CONTEXT,
      dockerfile: INSTANCE_CONSTANT.DOCKERFILE,
      tag: image,
      labels: {
        [INSTANCE_CONSTANT.LABEL_MANAGED]: "true",
        [INSTANCE_CONSTANT.LABEL_TYPE]: INSTANCE_CONSTANT.TYPE,
        [INSTANCE_CONSTANT.LABEL_VERSION]: INSTANCE_CONSTANT.VERSION,
      },
      buildArgs: {
        VERSION: INSTANCE_CONSTANT.VERSION,
        PORT: INSTANCE_CONSTANT.PORT.toString(),
      },
    });

    this.logger.log(`Image "${image}" successfully built.`);
  }
}
