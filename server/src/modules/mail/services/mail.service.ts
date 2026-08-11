import { MailTemplateService, TemplateMail } from "./mailTemplate.service";
import { MailStrategyRegistry } from "../mailStrategy.registry";
import { Injectable } from "@nestjs/common";

interface InterfaceSendProps {
  context: Record<string, string | number>;
  template: TemplateMail;
  subject: string;
  to: string;
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailStrategyRegistry: MailStrategyRegistry,
    private readonly mailTemplateService: MailTemplateService,
  ) {}

  public async send(props: InterfaceSendProps): Promise<void> {
    const html = await this.mailTemplateService.render(props.template, {
      ...props.context,
      ...props,
    });

    return this.mailStrategyRegistry.mailStrategy.send({
      context: props.context,
      subject: props.subject,
      to: props.to,
      html: html,
    });
  }
}
