import { ForgotPasswordVerificationStrategy } from "./strategies/forgotPasswordVerification.strategy";
import { SignUpVerificationStrategy } from "./strategies/signUpVerification.strategy";
import { InterfaceBaseVerificationStrategy } from "./strategies/base.strategy";
import { EmailVerificationType } from "./emailVerification.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VerificationStrategyRegistry {
  constructor(
    private readonly forgotPasswordVerificationStrategy: ForgotPasswordVerificationStrategy,
    private readonly signUpVerificationStrategy: SignUpVerificationStrategy,
  ) {}

  public get strategies(): Record<EmailVerificationType, InterfaceBaseVerificationStrategy> {
    return {
      [EmailVerificationType.SIGN_UP]: this.signUpVerificationStrategy,
      [EmailVerificationType.FORGOT_PASSWORD]: this.forgotPasswordVerificationStrategy,
    };
  }
}
