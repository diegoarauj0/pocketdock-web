import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

export enum ConcurrentEmailVerificationReason {
  DUPLICATE_ACTIVE_VERIFICATION = "DUPLICATE_ACTIVE_VERIFICATION",
  REVOKE_RACE_LOST = "REVOKE_RACE_LOST",
}

export class ConcurrentEmailVerificationException extends BaseException<{ reason: ConcurrentEmailVerificationReason }> {
  constructor(reason: ConcurrentEmailVerificationReason) {
    super({
      code: BaseExceptionCode.CONCURRENT_EMAIL_VERIFICATION,
      statusCode: HttpStatus.CONFLICT,
      message: "Conflict when sending verification email.",
      details: {
        reason: reason,
      },
    });
  }
}
