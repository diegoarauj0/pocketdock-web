import { MailTemplateService } from "./services/mailTemplate.service";
import { MailTranslationService } from "./services/mailTranslation.service";
import { ResendMailStrategy } from "./strategies/resend.strategy";
import { LocalMailStrategy } from "./strategies/local.strategy";
import { MailStrategyRegistry } from "./mailStrategy.registry";
import { MailService } from "./services/mail.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    MailService,
    MailTemplateService,
    MailTranslationService,
    MailStrategyRegistry,
    ResendMailStrategy,
    LocalMailStrategy,
  ],
  exports: [MailService, MailTranslationService],
})
export class MailModule {}
