import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";
import { env } from "src/config/env";

export enum InvalidSessionReason {
  INVALID_SESSION = "INVALID_SESSION",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  TOKEN_REUSE = "TOKEN_REUSE",
  NOT_FOUND = "NOT_FOUND",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

export class InvalidSessionException extends BaseException<{ reason: InvalidSessionReason }> {
  constructor(reason: InvalidSessionReason, clearAuthenticationCookie?: boolean) {
    super({
      code: BaseExceptionCode.INVALID_SESSION,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "Invalid session.",
      actions: { clearAuthenticationCookie },
      details: {
        reason: env.NODE_ENV === "production" ? InvalidSessionReason.INVALID_SESSION : reason,
      },
    });
  }
}
