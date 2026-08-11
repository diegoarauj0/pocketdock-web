import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

export enum InvalidOAuthStateReason {
  MISSING_STATE_COOKIE = "MISSING_STATE_COOKIE",
  STATE_MISMATCH = "STATE_MISMATCH",
}

export class InvalidOAuthStateException extends BaseException<{ reason: InvalidOAuthStateReason }> {
  constructor(reason: InvalidOAuthStateReason) {
    super({
      code: BaseExceptionCode.INVALID_OAUTH_STATE,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "Invalid or expired OAuth state.",
      details: {
        reason: reason,
      },
    });
  }
}
