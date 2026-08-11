import { InterfaceBaseMailStrategy, InterfaceSendProps, MailStrategyID } from "./base.strategy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalMailStrategy implements InterfaceBaseMailStrategy {
  public readonly mailStrategyID = MailStrategyID.LOCAL;

  public send(props: InterfaceSendProps): Promise<void> {
    const timestamp = new Date().toISOString();
    const divider = "─".repeat(60);

    console.log(`\n\x1b[36m${divider}\x1b[0m`);
    console.log(`\x1b[36m📧 LOCAL MAIL\x1b[0m  \x1b[90m${timestamp}\x1b[0m`);
    console.log(`\x1b[1mSubject:\x1b[0m ${props.subject}`);
    console.log(`\x1b[1mTo:\x1b[0m      ${props.to}`);

    if (props.context && Object.keys(props.context).length > 0) {
      console.log(`\x1b[1mContext:\x1b[0m`);
      console.table(props.context);
    }

    console.log(`\x1b[36m${divider}\x1b[0m\n`);

    return Promise.resolve();
  }
}
