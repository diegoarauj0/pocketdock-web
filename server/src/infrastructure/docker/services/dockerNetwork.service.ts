import { DockerService } from "./docker.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DockerNetworkService {
  constructor(private readonly dockerService: DockerService) {}

  public async ensureNetwork(name: string, driver = "bridge"): Promise<boolean> {
    const dockerClient = this.dockerService.getClient();

    const networks = await dockerClient.listNetworks();

    if (networks.some((network) => network.Name === name)) {
      return false;
    }

    await dockerClient.createNetwork({
      Name: name,
      Driver: driver,
      CheckDuplicate: true,
    });

    return true;
  }
}
