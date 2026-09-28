export enum MailStrategyID {
  RESEND = "RESEND",
  LOCAL = "LOCAL",
}

export interface InterfaceSendProps {
  context: Record<string, string | number>;
  html: string;
  subject: string;
  to: string;
}

export interface InterfaceBaseMailStrategy {
  mailStrategyID: MailStrategyID;

  send(props: InterfaceSendProps): Promise<void>;
}
