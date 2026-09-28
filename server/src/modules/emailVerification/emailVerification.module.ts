import { CommonModule } from "src/common/common.module";
import { EmailVerificationCleanupJob } from "./jobs/emailVerificationCleanup.job";
import { ForgotPasswordVerificationStrategy } from "./strategies/forgotPasswordVerification.strategy";
import { EmailVerificationRepository } from "./repositories/emailVerification.repository";
import { SignUpVerificationStrategy } from "./strategies/signUpVerification.strategy";
import { EmailVerificationService } from "./services/emailVerification.service";
import { VerificationStrategyRegistry } from "./verificationStrategy.registry";
import { EmailVerificationEntity } from "./emailVerification.entity";
import { UsersModule } from "../users/users.module";
import { MailModule } from "../mail/mail.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [CommonModule, UsersModule, MailModule, TypeOrmModule.forFeature([EmailVerificationEntity])],
  providers: [
    EmailVerificationService,
    EmailVerificationCleanupJob,
    SignUpVerificationStrategy,
    ForgotPasswordVerificationStrategy,
    VerificationStrategyRegistry,
    EmailVerificationRepository,
  ],
  exports: [EmailVerificationService, EmailVerificationRepository],
})
export class EmailVerificationModule {}
