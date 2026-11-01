import {
  InterfaceContainer,
  InterfaceContainerCpuUsage,
  InterfaceContainerMemoryUsage,
  InterfaceContainerStatus,
  InterfaceCreateContainerOptions,
  InterfaceExecResult,
} from "../docker.type";
import { DockerService } from "./docker.service";
import { isNotFoundError } from "../docker.util";
import { Injectable } from "@nestjs/common";
import { Writable } from "node:stream";
import { env } from "src/config/env";
import Docker from "dockerode";

@Injectable()
export class DockerContainerService {
  constructor(private readonly dockerService: DockerService) {}

  public async createContainer(options: InterfaceCreateContainerOptions): Promise<InterfaceContainer> {
    const docker = this.dockerService.getClient();

    const { id } = await docker.createContainer({
      name: options.name,
      Image: options.image,
      Env: options.env,
      Cmd: options.cmd,
      Labels: options.labels,
      ExposedPorts: options.exposedPorts,
      HostConfig: options.hostConfig,
      NetworkingConfig: options.networkingConfig,
    });

    return { id };
  }

  private getContainer(id: string): Docker.Container {
    const docker = this.dockerService.getClient();

    return docker.getContainer(id);
  }

  public async containerExists(name: string): Promise<boolean> {
    try {
      await this.getContainer(name).inspect();
      return true;
    } catch (error) {
      if (isNotFoundError(error)) return false;
      throw error;
    }
  }

  public async deleteContainer(id: string, force = false): Promise<void> {
    const container = this.getContainer(id);

    try {
      await container.remove({
        force,
      });
    } catch (error) {
      if (isNotFoundError(error)) return;

      throw error;
    }
  }

  public async getStatsContainer(id: string): Promise<Docker.ContainerStats> {
    const container = this.getContainer(id);

    return await container.stats({ stream: false });
  }

  public async getContainerMemoryUsage(name: string): Promise<InterfaceContainerMemoryUsage> {
    const { memory_stats } = await this.getStatsContainer(name);

    const usage = memory_stats?.usage ?? 0;
    const cache = memory_stats?.stats?.cache ?? 0;
    const limitBytes = memory_stats?.limit ?? env.MAX_MEMORY_IN_MB * 1024 * 1024;

    return {
      usedBytes: Math.max(usage - cache, 0),
      limitBytes,
    };
  }

  public async getContainerCpuUsage(name: string): Promise<InterfaceContainerCpuUsage> {
    const { cpu_stats, precpu_stats } = await this.getStatsContainer(name);

    return {
      totalUsage: cpu_stats?.cpu_usage?.total_usage ?? 0,
      previousTotalUsage: precpu_stats?.cpu_usage?.total_usage ?? 0,
      systemUsage: cpu_stats?.system_cpu_usage ?? 0,
      previousSystemUsage: precpu_stats?.system_cpu_usage ?? 0,
      onlineCpus: cpu_stats?.online_cpus ?? 0,
    };
  }

  public async getContainerStatus(name: string): Promise<InterfaceContainerStatus> {
    const container = this.getContainer(name);

    const { State } = await container.inspect();

    return {
      paused: State.Paused,
      running: State.Running,
      status: State.Status,
    };
  }

  public async startContainer(name: string): Promise<void> {
    const container = this.getContainer(name);

    await container.start();
  }

  public async stopContainer(id: string): Promise<void> {
    const container = this.getContainer(id);

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
