import type { OnApplicationShutdown, OnModuleDestroy } from "@nestjs/common";
import { LOCK_CONSTANT } from "src/infrastructure/lock/lock.constant";
import { Injectable, Logger } from "@nestjs/common";
import type { QueryRunner } from "typeorm";
import { DataSource } from "typeorm";
import { env } from "src/config/env";

export type LockAcquireFailureReason = "LOCKED" | "ALREADY_HELD" | "INVALID_RESOURCE" | "INVALID_TIMEOUT" | "ERROR";

export interface InterfaceLockAcquireSuccess {
  acquired: true;
  expiresAt: Date;
}

export interface InterfaceLockAcquireFailure {
  acquired: false;
  reason: LockAcquireFailureReason;
}

export type InterfaceLockAcquireResult = InterfaceLockAcquireSuccess | InterfaceLockAcquireFailure;

interface InterfaceLockEntry {
  resourceId: string;
  queryRunner: QueryRunner;
  expiresAt: Date;
  timer: NodeJS.Timeout;
}

interface InterfaceAdvisoryLockQueryResult {
  acquired?: boolean;
  released?: boolean;
}

type DiscardableQueryRunner = QueryRunner & {
  releasePostgresConnection?: (error?: Error) => Promise<void>;
};

@Injectable()
export class LockService implements OnApplicationShutdown, OnModuleDestroy {
  private readonly logger = new Logger(LockService.name);

  private readonly locks = new Map<string, InterfaceLockEntry>();

  private readonly pendingAcquisitions = new Set<string>();

  private isShuttingDown = false;

  constructor(private readonly dataSource: DataSource) {}

  public async acquire(resourceId: string, timeoutMs?: number): Promise<InterfaceLockAcquireResult> {
    if (this.isShuttingDown) {
      this.logger.warn(`Cannot acquire lock for resource "${resourceId}" while the application is shutting down.`);

      return { acquired: false, reason: "ERROR" };
    }

    if (resourceId.trim().length === 0) {
      return { acquired: false, reason: "INVALID_RESOURCE" };
    }

    const effectiveTimeoutMs = timeoutMs ?? env.LOCK_DEFAULT_TIMEOUT_MS;

    if (!Number.isFinite(effectiveTimeoutMs) || effectiveTimeoutMs <= 0) {
      this.logger.warn(`Invalid lock timeout "${timeoutMs}" for resource "${resourceId}".`);

      return { acquired: false, reason: "INVALID_TIMEOUT" };
    }

    if (this.locks.has(resourceId) || this.pendingAcquisitions.has(resourceId)) {
      return { acquired: false, reason: "ALREADY_HELD" };
    }

    this.pendingAcquisitions.add(resourceId);

    try {
      return await this.tryAcquire(resourceId, effectiveTimeoutMs);
    } finally {
      this.pendingAcquisitions.delete(resourceId);
    }
  }

  public async release(resourceId: string): Promise<boolean> {
    const entry = this.locks.get(resourceId);

    if (entry === undefined) {
      return false;
    }

    this.locks.delete(resourceId);
    clearTimeout(entry.timer);

    return this.unlockAndRelease(entry.queryRunner, resourceId);
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.shutdown();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.shutdown();
  }

  private async tryAcquire(resourceId: string, timeoutMs: number): Promise<InterfaceLockAcquireResult> {
    const queryRunner = this.dataSource.createQueryRunner();

    let lockAcquired = false;

    try {
      await queryRunner.connect();

      const results = (await queryRunner.query(LOCK_CONSTANT.SQL.TRY_ACQUIRE, [
        resourceId,
      ])) as InterfaceAdvisoryLockQueryResult[];

      lockAcquired = results[0]?.acquired === true;

      if (!lockAcquired) {
        await this.releaseQueryRunner(queryRunner);

        return { acquired: false, reason: "LOCKED" };
      }

      if (this.locks.has(resourceId)) {
        await this.unlockAndRelease(queryRunner, resourceId);

        return { acquired: false, reason: "ALREADY_HELD" };
      }

      if (this.isShuttingDown) {
        await this.unlockAndRelease(queryRunner, resourceId);

        return { acquired: false, reason: "ERROR" };
      }

      const expiresAt = new Date(Date.now() + timeoutMs);
      const timer = setTimeout(() => this.handleExpiration(resourceId), timeoutMs);

      timer.unref();

      this.locks.set(resourceId, { resourceId, queryRunner, expiresAt, timer });

      return { acquired: true, expiresAt };
    } catch (error) {
      this.logger.error(`Failed to acquire advisory lock for resource "${resourceId}".`, error);

      if (lockAcquired) {
        await this.unlockAndRelease(queryRunner, resourceId);
      } else {
        await this.releaseQueryRunner(queryRunner);
      }

      return { acquired: false, reason: "ERROR" };
    }
  }

  private handleExpiration(resourceId: string): void {
    void this.release(resourceId)
      .then((released) => {
        if (released) {
          this.logger.warn(`Advisory lock for resource "${resourceId}" expired after its timeout.`);
        }
      })
      .catch((error) => {
        this.logger.error(`Failed to release expired advisory lock for resource "${resourceId}".`, error);
      });
  }

  private async unlockAndRelease(queryRunner: QueryRunner, resourceId: string): Promise<boolean> {
    try {
      const results = (await queryRunner.query(LOCK_CONSTANT.SQL.RELEASE, [
        resourceId,
      ])) as InterfaceAdvisoryLockQueryResult[];

      const unlocked = results[0]?.released === true;

      if (!unlocked) {
        this.logger.warn(`Advisory lock for resource "${resourceId}" was not held by its connection when released.`);
      }

      await this.releaseQueryRunner(queryRunner);

      return unlocked;
    } catch (error) {
      this.logger.error(
        `Failed to release advisory lock for resource "${resourceId}". Discarding its connection.`,
        error,
      );

      await this.discardQueryRunner(queryRunner);

      return false;
    }
  }

  private async releaseQueryRunner(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.isReleased) return;

    try {
      await queryRunner.release();
    } catch (error) {
      this.logger.error("Failed to return the lock connection to the pool. Discarding it.", error);

      await this.discardQueryRunner(queryRunner);
    }
  }

  private async discardQueryRunner(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.isReleased) return;

    const discardable = queryRunner as DiscardableQueryRunner;

    try {
      if (typeof discardable.releasePostgresConnection === "function") {
        await discardable.releasePostgresConnection(
          new Error("Discarding connection because the advisory lock release could not be guaranteed."),
        );

        return;
      }
    } catch (error) {
      this.logger.error("Failed to discard the lock connection through TypeORM.", error);
    }

    try {
      await queryRunner.release();
    } catch (error) {
      this.logger.error("Failed to release the lock connection after the discard attempt.", error);
    }
  }

  private async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;

    const resourceIds = Array.from(this.locks.keys());

    const results = await Promise.allSettled(
      resourceIds.map(async (resourceId) => {
        const released = await this.release(resourceId);

        if (!released) {
          this.logger.warn(`Advisory lock for resource "${resourceId}" could not be gracefully released on shutdown.`);
        }
      }),
    );

    for (const result of results) {
      if (result.status === "rejected") {
        this.logger.error("Failed to release an advisory lock during shutdown.", result.reason);
      }
    }
  }
}
