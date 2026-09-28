import { SessionService } from "../services/session.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SessionCleanupJob {
  private readonly logger = new Logger(SessionCleanupJob.name);

  constructor(private readonly sessionService: SessionService) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async cleanupExpiredSessions(): Promise<void> {
    const count = await this.sessionService.deleteExpiredSessions();

    if (count > 0) this.logger.log(`Removed ${count} expired sessions.`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  public async cleanupRevokedSessions(): Promise<void> {
    const count = await this.sessionService.deleteOldRevokedSessions();

    if (count > 0) this.logger.log(`Removed ${count} old revoked sessions.`);
  }
}
