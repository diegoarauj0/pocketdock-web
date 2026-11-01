import { InterfaceContainerCpuUsage, InterfaceContainerMemoryUsage } from "src/infrastructure/docker/docker.type";
import { ContainerErrorReason, InstanceContainerException } from "../exceptions/instanceContainer.exception";
import { OutboxEventEntity, OutboxEventStatus } from "src/infrastructure/outbox/outboxEvent.entity";
import { DockerContainerService } from "src/infrastructure/docker/services/dockerContainer.service";
import { InstanceNotFoundException } from "../exceptions/instanceNotFoundException.exception";
import { OutboxEventService } from "src/infrastructure/outbox/services/outboxEvent.service";
import { LockService } from "src/infrastructure/lock/services/lock.service";
import { InstanceRepository } from "../repositories/instance.repository";
import { CryptoService } from "src/common/services/crypto.service";
import { UserEntity } from "src/modules/users/user.entity";
import { INSTANCE_CONSTANT } from "../instance.constant";
import { InstanceEntity, InstanceStatus } from "../instance.entity";
import { Injectable, Logger } from "@nestjs/common";
import { env } from "src/config/env";
import { DataSource } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";

interface InterfaceCalculateUsage {
  percent: number;
  limit: number;
  used: number;
}

interface InterfaceState {
  memory: InterfaceCalculateUsage;
  cpu: InterfaceCalculateUsage;
  status: "running" | "stopped";
}

@Injectable()
export class InstancesService {
  private readonly logger = new Logger(InstancesService.name);

  constructor(
    private readonly dockerContainerService: DockerContainerService,
    private readonly instanceRepository: InstanceRepository,
    private readonly outboxEventService: OutboxEventService,
    private readonly cryptoService: CryptoService,
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
    private readonly lockService: LockService,
  ) {}

  public async create(user: UserEntity): Promise<InstanceEntity> {
    const id = this.cryptoService.randomUUID();
    const containerName = `${INSTANCE_CONSTANT.CONTAINER_NAME_PREFIX}-${id}`;
    const defaultPassword = this.cryptoService.randomHash();

    const instance = this.instanceRepository.create({
      id,
      userId: user.id,
      containerName,
      defaultPassword,
    });

    const outboxEvent = this.outboxEventService.create({
      id: this.cryptoService.randomUUID(),
      status: OutboxEventStatus.PENDING,
      type: INSTANCE_CONSTANT.OUTBOX.CREATION.TYPE,
      attempts: 0,
      maxAttempts: INSTANCE_CONSTANT.OUTBOX.CREATION.MAX_ATTEMPTS,
      payload: {
        instanceId: id,
        containerName,
        defaultPassword,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });

    try {
      const { savedOutboxEvent, savedInstance } = await this.dataSource.transaction(async (manager) => {
        const savedInstance = await manager.save(InstanceEntity, instance);
        const savedOutboxEvent = await manager.save(OutboxEventEntity, outboxEvent);
        return { savedInstance, savedOutboxEvent };
      });

      this.eventEmitter.emit(INSTANCE_CONSTANT.OUTBOX.CREATION.EVENT, { outboxEventId: savedOutboxEvent.id });

      return savedInstance;
    } catch (error) {
      this.logger.error("Failed to enqueue instance creation outbox event.", { userId: user.id, containerName });
      this.logger.error(error);
      throw new InstanceContainerException(ContainerErrorReason.CREATE_FAILED);
    }
  }

  public async findAllByUserId(userId: string): Promise<InstanceEntity[]> {
    return this.instanceRepository.findByUserId(userId);
  }

  public async updateStatus(id: string, status: InstanceStatus): Promise<void> {
    await this.instanceRepository.updateStatus(id, status);
  }

  public async findOwnedById(id: string, userId: string): Promise<InstanceEntity> {
    const instance = await this.instanceRepository.findByIdAndUserId(id, userId);

    if (instance === null) {
      throw new InstanceNotFoundException();
    }

    return instance;
  }

  private assertContainerReady(instance: InstanceEntity): void {
    if (instance.status !== InstanceStatus.COMPLETED) {
      throw new InstanceContainerException(ContainerErrorReason.NOT_READY);
    }
  }

  /**
   * Serializes start, stop and remove operations for the same instance.
   * The lock is acquired before reading the instance state again so the operation
   * always works with a fresh row and cannot interleave with another mutation.
   */
  private async withInstanceLock<T>(
    id: string,
    userId: string,
    operation: (instance: InstanceEntity) => Promise<T>,
  ): Promise<T> {
    // Validate ownership before acquiring the lock so another user's instance is not exposed.
    await this.findOwnedById(id, userId);

    const resourceId = `${INSTANCE_CONSTANT.LOCK.RESOURCE_PREFIX}:${id}`;
    const lock = await this.lockService.acquire(resourceId, INSTANCE_CONSTANT.LOCK.TIMEOUT_MS);

    if (!lock.acquired) {
      throw new InstanceContainerException(ContainerErrorReason.OPERATION_IN_PROGRESS);
    }

    try {
      const instance = await this.findOwnedById(id, userId);

      return await operation(instance);
    } finally {
      try {
        await this.lockService.release(resourceId);
      } catch (error) {
        this.logger.error(`Failed to release instance lock for resource "${resourceId}".`, error);
      }
    }
  }

  public async stop(name: string, userId: string): Promise<InstanceEntity> {
    return this.withInstanceLock(name, userId, async (instance) => {
      this.assertContainerReady(instance);

      const { running, status } = await this.dockerContainerService.getContainerStatus(instance.containerName);

      if (running === false || status === "exited") {
        throw new InstanceContainerException(ContainerErrorReason.ALREADY_STOPPED);
      }

      try {
        await this.dockerContainerService.stopContainer(instance.containerName);

        return instance;
      } catch (error) {
        this.logger.error("Failed to stop instance container.", { id: name });
        this.logger.error(error);

        throw new InstanceContainerException(ContainerErrorReason.STOP_FAILED);
      }
    });
  }

  public async start(name: string, userId: string): Promise<InstanceEntity> {
    return this.withInstanceLock(name, userId, async (instance) => {
      this.assertContainerReady(instance);

      const { running } = await this.dockerContainerService.getContainerStatus(instance.containerName);

      if (running === true) {
        throw new InstanceContainerException(ContainerErrorReason.ALREADY_RUNNING);
      }

      try {
        await this.dockerContainerService.startContainer(instance.containerName);

        return instance;
      } catch (error) {
        this.logger.error("Failed to start instance container.", { id: name });
        this.logger.error(error);

        throw new InstanceContainerException(ContainerErrorReason.START_FAILED);
      }
    });
  }

  public async remove(id: string, userId: string): Promise<InstanceEntity> {
    return this.withInstanceLock(id, userId, async (instance) => {
      if (instance.status === InstanceStatus.PENDING) {
        throw new InstanceContainerException(ContainerErrorReason.NOT_READY);
      }

      try {
        const { outboxEvent } = await this.dataSource.transaction(async (manager) => {
          await manager.delete(InstanceEntity, { id: instance.id });
          const outboxEvent = await manager.save(OutboxEventEntity, this.createRemovalEvent(instance));

          return { outboxEvent };
        });

        this.eventEmitter.emit(INSTANCE_CONSTANT.OUTBOX.REMOVAL.EVENT, { outboxEventId: outboxEvent.id });

        return instance;
      } catch (error) {
        this.logger.error("Failed to enqueue instance removal outbox event.", { id });
        this.logger.error(error);

        throw error;
      }
    });
  }

  private calculateMemoryUsage(usage: InterfaceContainerMemoryUsage): InterfaceCalculateUsage {
    const { usedBytes, limitBytes } = usage;

    return {
      percent: limitBytes > 0 ? (usedBytes / limitBytes) * 100 : 0,
      limit: limitBytes / 1024 / 1024,
      used: usedBytes / 1024 / 1024,
    };
  }

  private calculateCpuUsage(usage: InterfaceContainerCpuUsage): InterfaceCalculateUsage {
    const { totalUsage, previousTotalUsage, systemUsage, previousSystemUsage, onlineCpus } = usage;

    const systemDelta = Math.max(systemUsage - previousSystemUsage, 0);
    const cpuDelta = Math.max(totalUsage - previousTotalUsage, 0);
    const cpuLimit = env.MAX_NANO_CPUS / 1_000_000_000;

    const usedCpus = systemDelta > 0 ? (cpuDelta / systemDelta) * onlineCpus : 0;
    const usagePercent = cpuLimit > 0 ? (usedCpus / cpuLimit) * 100 : 0;

    return {
      percent: usagePercent,
      limit: cpuLimit,
      used: usedCpus,
    };
  }

  public async stats(id: string, userId: string): Promise<InterfaceState> {
    const instance = await this.findOwnedById(id, userId);
    const status = await this.dockerContainerService.getContainerStatus(instance.containerName);

    if (status.running === false || status.paused === true) {
      return {
        cpu: { percent: 0, limit: 0, used: 0 },
        memory: { percent: 0, limit: 0, used: 0 },
        status: "stopped",
      };
    }

    const [memoryUsage, cpuUsage] = await Promise.all([
      this.dockerContainerService.getContainerMemoryUsage(instance.containerName),
      this.dockerContainerService.getContainerCpuUsage(instance.containerName),
    ]);

    const cpu = this.calculateCpuUsage(cpuUsage);
    const memory = this.calculateMemoryUsage(memoryUsage);

    return { cpu, memory, status: "running" };
  }

  public async removeAllContainersByUserId(userId: string): Promise<void> {
    const instances = await this.instanceRepository.findByUserId(userId);

    if (instances.length === 0) return;

    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.delete(InstanceEntity, { userId: userId });
        await manager.save(
          OutboxEventEntity,
          instances.map((instance) => this.createRemovalEvent(instance)),
        );
      });
    } catch (error) {
      this.logger.error("Failed to enqueue instance removal outbox events.", { userId });
      this.logger.error(error);

      throw error;
    }
  }

  private createRemovalEvent(instance: InstanceEntity): OutboxEventEntity {
    return this.outboxEventService.create({
      id: this.cryptoService.randomUUID(),
      status: OutboxEventStatus.PENDING,
      type: INSTANCE_CONSTANT.OUTBOX.REMOVAL.TYPE,
      attempts: 0,
      maxAttempts: INSTANCE_CONSTANT.OUTBOX.REMOVAL.MAX_ATTEMPTS,
      payload: {
        instanceId: instance.id,
        containerName: instance.containerName,
      },
    });
  }
}
