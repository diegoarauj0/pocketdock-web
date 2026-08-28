import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";
import { env } from "src/config/env";

export enum InvalidTokenReason {
  REQUIRED = "REQUIRED",
  INVALID = "INVALID",
  EXPIRED = "EXPIRED",
}

export class InvalidTokenException extends BaseException<{ reason: InvalidTokenReason; name: string }> {
  constructor(name: string, reason: InvalidTokenReason) {
    super({
      code: BaseExceptionCode.INVALID_TOKEN,
      statusCode: HttpStatus.FORBIDDEN,
      message: "Invalid token.",
      details: {
        name: name,
        reason: env.NODE_ENV === "production" ? InvalidTokenReason.INVALID : reason,
      },
    });
  }
}
