import { InterfaceBaseMailStrategy, MailStrategyID } from "./strategies/base.strategy";
import { ResendMailStrategy } from "./strategies/resend.strategy";
import { LocalMailStrategy } from "./strategies/local.strategy";
import { Injectable } from "@nestjs/common";
import { env } from "src/config/env";

@Injectable()
export class MailStrategyRegistry {
  constructor(
    private readonly resendMailStrategy: ResendMailStrategy,
    private readonly localMailStrategy: LocalMailStrategy,
  ) {}

  public get mailStrategy(): InterfaceBaseMailStrategy {
    const mailStrategiesMap: Record<MailStrategyID, InterfaceBaseMailStrategy> = {
      [MailStrategyID.LOCAL]: this.localMailStrategy,
      [MailStrategyID.RESEND]: this.resendMailStrategy,
    };

    const mailStrategyID = env.MAIL_STRATEGY_ID;

    return mailStrategiesMap[mailStrategyID];
  }
}
