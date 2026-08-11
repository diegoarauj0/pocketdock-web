import { EmailVerificationType } from "../emailVerification.entity";

export interface InterfaceBaseVerificationStrategy<Payload = any> {
  emailVerificationType: EmailVerificationType;

  execute(email: string, userID: string, payload?: Payload): Promise<void>;
}
