import { EmailVerificationType } from "../emailVerification.entity";

export interface InterfaceBaseVerificationStrategy<Payload = any> {
  emailVerificationType: EmailVerificationType;

  execute(email: string, userId: string, payload?: Payload): Promise<void>;
}
