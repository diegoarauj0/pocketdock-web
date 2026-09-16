import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

export enum OAuthEmailConflictReason {
  EXISTING_ACCOUNT_EMAIL_NOT_VERIFIED = "EXISTING_ACCOUNT_EMAIL_NOT_VERIFIED",
}

export class OAuthEmailConflictException extends BaseException<{ reason: OAuthEmailConflictReason }> {
  constructor(reason: OAuthEmailConflictReason) {
    super({
      code: BaseExceptionCode.OAUTH_EMAIL_CONFLICT,
      statusCode: HttpStatus.CONFLICT,
      message: "Cannot authenticate via OAuth due to a conflict with an existing account's email.",
      details: {
        reason: reason,
      },
    });
  }
}
