import { InterfaceBaseMailStrategy, InterfaceSendProps, MailStrategyID } from "./base.strategy";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { env } from "src/config/env";
import { Resend } from "resend";

@Injectable()
export class ResendMailStrategy implements InterfaceBaseMailStrategy, OnModuleInit {
  private resend!: Resend;

  public readonly mailStrategyID = MailStrategyID.RESEND;

  public onModuleInit() {
    if (env.MAIL_STRATEGY_ID === this.mailStrategyID) {
      this.resend = new Resend(env.RESEND_API_KEY);
    }
  }

  public async send(props: InterfaceSendProps): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: env.RESEND_FROM,
      subject: props.subject,
      html: props.html,
      to: props.to,
    });

    if (error) throw error as Error;
  }
}
