import { InstancesService } from "../services/instances.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class InstanceCleanupJob {
  private readonly logger = new Logger(InstanceCleanupJob.name);

  constructor(private readonly instancesService: InstancesService) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async cleanupOrphanedInstances(): Promise<void> {
    const count = await this.instancesService.removeOrphanedInstances();

    if (count > 0) this.logger.log(`Removed ${count} orphaned instances (missing container).`);
  }
}
