import { Injectable } from "@nestjs/common";
import Docker from "dockerode";

@Injectable()
export class DockerService {
  private readonly docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  public getClient(): Docker {
    return this.docker;
  }

  public async ping(): Promise<void> {
    await this.docker.ping();
  }
}
