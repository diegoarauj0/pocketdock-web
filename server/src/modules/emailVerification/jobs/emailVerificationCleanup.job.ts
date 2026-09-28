import { EmailVerificationService } from "../services/emailVerification.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class EmailVerificationCleanupJob {
  private readonly logger = new Logger(EmailVerificationCleanupJob.name);

  constructor(private readonly emailVerificationService: EmailVerificationService) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async revokeExpiredVerifications(): Promise<void> {
    const count = await this.emailVerificationService.revokeExpiredVerifications();

    if (count > 0) this.logger.log(`Revoked ${count} expired email verifications.`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  public async deleteOldVerifications(): Promise<void> {
    const count = await this.emailVerificationService.deleteOldVerifications();

    if (count > 0) this.logger.log(`Removed ${count} old email verifications.`);
  }
}
