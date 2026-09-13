import { InterfaceContainerStatus, InterfaceCreateContainerOptions } from "../docker.type";
import { DockerService } from "./docker.service";
import { isNotFoundError } from "../docker.util";
import { Injectable } from "@nestjs/common";
import Docker from "dockerode";

@Injectable()
export class DockerContainerService {
  constructor(private readonly dockerService: DockerService) {}

  public async createContainer(options: InterfaceCreateContainerOptions): Promise<Docker.Container> {
    const docker = this.dockerService.getClient();

    return docker.createContainer({
      name: options.name,
      Image: options.image,
      Env: options.env,
      Cmd: options.cmd,
      Labels: options.labels,
      ExposedPorts: options.exposedPorts,
      HostConfig: options.hostConfig,
    });
  }

  public getContainer(name: string): Docker.Container {
    const docker = this.dockerService.getClient();

    return docker.getContainer(name);
  }

  public async containerExists(name: string): Promise<boolean> {
    try {
      await this.getContainer(name).inspect();

      return true;
    } catch (error) {
      if (isNotFoundError(error)) {
        return false;
      }

      throw error;
    }
  }

  public async deleteContainer(name: string, force = false): Promise<void> {
    const container = this.getContainer(name);

    await container.remove({
      force,
    });
  }

  public async getStatsContainer(name: string): Promise<Docker.ContainerStats> {
    const container = this.getContainer(name);

    return await container.stats({ stream: false });
  }

  public async getContainerStatus(name: string): Promise<InterfaceContainerStatus> {
    const container = this.getContainer(name);

    const { State } = await container.inspect();

    return {
      paused: State.Paused,
      running: State.Running,
    };
  }

  public async startContainer(name: string): Promise<void> {
    const container = this.getContainer(name);

    await container.start();
  }

  public async stopContainer(name: string): Promise<void> {
    const container = this.getContainer(name);

    await container.stop();
  }
}
