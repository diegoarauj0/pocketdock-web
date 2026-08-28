import { ContainerErrorReason, InstanceContainerException } from "../exceptions/instanceContainer.exception";
import { DockerContainerService } from "src/infrastructure/docker/services/dockerContainer.service";
import { InstanceNotFoundException } from "../exceptions/instanceNotFoundException.exception";
import { DOCKER_CONSTANT } from "src/infrastructure/docker/docker.constant";
import { InstanceRepository } from "../repositories/instance.repository";
import { isAlreadyPaused, isDockerApiError, isNotPaused } from "src/infrastructure/docker/docker.util";
import { CryptoService } from "src/common/services/crypto.service";
import { INSTANCE_CONSTANT } from "../instance.constant";
import { InstanceEntity } from "../instance.entity";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class InstanceService {
  private readonly logger = new Logger(InstanceService.name);

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly instanceRepository: InstanceRepository,
    private readonly dockerContainerService: DockerContainerService,
  ) {}

  public async create(userID: string): Promise<InstanceEntity> {
    const ID = this.cryptoService.randomUUID();
    const containerName = `${INSTANCE_CONSTANT.CONTAINER_NAME_PREFIX}-${ID}`;

    try {
      const image = `${DOCKER_CONSTANT.POCKETBASE_REPOSITORY}:${DOCKER_CONSTANT.POCKETBASE_VERSION}`;

      const labels = {
        [DOCKER_CONSTANT.POCKETBASE_LABEL_VERSION]: DOCKER_CONSTANT.POCKETBASE_VERSION,
        [DOCKER_CONSTANT.POCKETBASE_LABEL_TYPE]: DOCKER_CONSTANT.POCKETBASE_TYPE,
        [DOCKER_CONSTANT.POCKETBASE_LABEL_MANAGED]: "true",
        [DOCKER_CONSTANT.POCKETBASE_LABEL_INSTANCE_ID]: ID,
      };

      await this.dockerContainerService.createContainer({
        name: containerName,
        image: image,
        labels,
      });

      await this.dockerContainerService.startContainer(containerName);

      const instance = this.instanceRepository.create({
        ID,
        userID,
        containerName: containerName,
      });

      return this.instanceRepository.save(instance);
    } catch (error) {
      this.logger.error("Failed to create instance container.", { userID, containerName });
      this.logger.error(error);

      const { affected } = await this.instanceRepository.delete(ID);

      if (affected) {
        this.logger.warn(`Rolled back instance ${ID}`);
      }

      try {
        const exists = await this.dockerContainerService.containerExists(containerName);

        if (exists) {
          await this.dockerContainerService.deleteContainer(containerName, true);
        }
      } catch (cleanupError) {
        this.logger.error("Failed to cleanup instance container.", cleanupError);
      }

      if (isDockerApiError(error)) {
        throw new InstanceContainerException(ContainerErrorReason.CREATE_FAILED);
      }

      throw error;
    }
  }

  public async findAllByUserId(userID: string): Promise<InstanceEntity[]> {
    return this.instanceRepository.findByUserId(userID);
  }

  public async findOwnedById(ID: string, userID: string): Promise<InstanceEntity> {
    const instance = await this.instanceRepository.findByIdAndUserId(ID, userID);

    if (instance === null) {
      throw new InstanceNotFoundException();
    }

    return instance;
  }

  public async pause(ID: string, userID: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(ID, userID);

    try {
      await this.dockerContainerService.pauseContainer(instance.containerName);

      return instance;
    } catch (error) {
      this.logger.error("Failed to pause instance container.", { ID });
      this.logger.error(error);

      if (isAlreadyPaused(error)) {
        throw new InstanceContainerException(ContainerErrorReason.ALREADY_PAUSED);
      }

      throw new InstanceContainerException(ContainerErrorReason.PAUSE_FAILED);
    }
  }

  public async resume(ID: string, userID: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(ID, userID);

    try {
      await this.dockerContainerService.unpauseContainer(instance.containerName);

      return instance;
    } catch (error) {
      this.logger.error("Failed to resume instance container.", { ID });
      this.logger.error(error);

      if (isNotPaused(error)) {
        throw new InstanceContainerException(ContainerErrorReason.ALREADY_RUNNING);
      }

      throw new InstanceContainerException(ContainerErrorReason.UNPAUSE_FAILED);
    }
  }

  public async remove(ID: string, userID: string): Promise<InstanceEntity> {
    const instance = await this.findOwnedById(ID, userID);

    try {
      await this.dockerContainerService.deleteContainer(instance.containerName, true);
    } catch {
      this.logger.error("Failed to remove instance container.", { ID, containerName: instance.containerName });
      throw new InstanceContainerException(ContainerErrorReason.REMOVE_FAILED);
    }

    try {
      return await this.instanceRepository.remove(instance);
    } catch (error) {
      this.logger.error("Failed to remove instance database row.", { ID });

      throw error;
    }
  }
}
