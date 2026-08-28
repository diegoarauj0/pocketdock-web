import { InterfaceBuildImageOptions } from "../docker.type";
import { isNotFoundError } from "../docker.util";
import { DockerService } from "./docker.service";
import { Injectable } from "@nestjs/common";
import type Docker from "dockerode";
import tar from "tar-fs";

@Injectable()
export class DockerImageService {
  constructor(private readonly dockerService: DockerService) {}

  public async imageExists(name: string): Promise<boolean> {
    const dockerClient = this.dockerService.getClient();

    try {
      const image = dockerClient.getImage(name);

      await image.inspect();

      return true;
    } catch (error) {
      if (isNotFoundError(error)) {
        return false;
      }

      throw error;
    }
  }

  public async inspectImage(name: string): Promise<Docker.ImageInspectInfo> {
    const dockerClient = this.dockerService.getClient();

    const image = dockerClient.getImage(name);

    return image.inspect();
  }

  public async buildImage(options: InterfaceBuildImageOptions): Promise<Docker.ImageInspectInfo> {
    const dockerClient = this.dockerService.getClient();

    const { context, dockerfile = "Dockerfile", tag, labels, buildArgs } = options;

    const test = tar.pack(context);

    const stream = await dockerClient.buildImage(test, {
      buildargs: buildArgs,
      version: "2",
      dockerfile,
      t: tag,
      labels,
    });

    await this.awaitCompleteBuildImage(stream);

    return this.inspectImage(tag);
  }

  private awaitCompleteBuildImage(stream: NodeJS.ReadableStream): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dockerClient = this.dockerService.getClient();

      const handleFinished = (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      };

      const handleProgress = (event) => {
        if (event.stream) {
          process.stdout.write(event.stream);
        }

        if (event.error) {
          process.stderr.write(event.error);
        }
      };

      dockerClient.modem.followProgress(stream, handleFinished, handleProgress);
    });
  }

  public async removeImage(name: string): Promise<void> {
    const dockerClient = this.dockerService.getClient();

    try {
      const image = dockerClient.getImage(name);

      await image.remove();
    } catch (error) {
      if (isNotFoundError(error)) {
        return;
      }

      throw error;
    }
  }
}
