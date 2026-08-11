import { CommonModule } from "src/common/common.module";
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
    SignUpVerificationStrategy,
    ForgotPasswordVerificationStrategy,
    VerificationStrategyRegistry,
    EmailVerificationRepository,
  ],
  exports: [EmailVerificationService, EmailVerificationRepository],
})
export class EmailVerificationModule {}
