import { InterfaceContainerStatus, InterfaceCreateContainerOptions, InterfaceExecResult } from "../docker.type";
import { DockerService } from "./docker.service";
import { isNotFoundError } from "../docker.util";
import { Injectable } from "@nestjs/common";
import Docker from "dockerode";
import { Writable } from "node:stream";

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
      NetworkingConfig: options.networkingConfig,
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

  public async execContainer(name: string, cmd: string[]): Promise<InterfaceExecResult> {
    const docker = this.dockerService.getClient();
    const container = this.getContainer(name);

    const exec = await container.exec({
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({
      hijack: false,
      stdin: false,
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    const stdoutCollector = new Writable({
      write(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        stdoutChunks.push(chunk);
        callback();
      },
    });

    const stderrCollector = new Writable({
      write(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        stderrChunks.push(chunk);
        callback();
      },
    });

    docker.modem.demuxStream(stream, stdoutCollector, stderrCollector);

    await new Promise<void>((resolve, reject) => {
      stream.once("error", reject);
      stream.once("end", resolve);
    });

    const { ExitCode } = await exec.inspect();

    return {
      exitCode: ExitCode ?? 0,
      stdout: Buffer.concat(stdoutChunks).toString("utf8").trim(),
      stderr: Buffer.concat(stderrChunks).toString("utf8").trim(),
    };
  }
}
