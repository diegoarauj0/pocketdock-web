import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";
import { env } from "src/config/env";

export enum InvalidEmailVerificationCodeReason {
  INVALID_CODE = "INVALID_CODE",
  ALREADY_USED = "ALREADY_USED",
  NOT_FOUND = "NOT_FOUND",
  EXPIRED = "EXPIRED",
}

export class InvalidEmailVerificationCodeException extends BaseException<{
  reason: InvalidEmailVerificationCodeReason;
}> {
  constructor(reason: InvalidEmailVerificationCodeReason) {
    super({
      code: BaseExceptionCode.INVALID_EMAIL_VERIFICATION_CODE,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Invalid code.",
      details: {
        reason: env.NODE_ENV === "production" ? InvalidEmailVerificationCodeReason.INVALID_CODE : reason,
      },
    });
  }
}
