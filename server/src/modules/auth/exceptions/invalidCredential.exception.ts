import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";
import { env } from "process";

export enum InvalidCredentialReason {
  INVALID_CREDENTIAL = "INVALID_CREDENTIAL",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  EMAIL_NOT_VERIFY = "EMAIL_NOT_VERIFY",
  USER_NOT_FOUND = "USER_NOT_FOUND",
}

export class InvalidCredentialException extends BaseException<{ reason: InvalidCredentialReason }> {
  constructor(reason: InvalidCredentialReason) {
    super({
      code: BaseExceptionCode.INVALID_CREDENTIAL,
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "Invalid credential.",
      details: {
        reason: env.NODE_ENV === "production" ? InvalidCredentialReason.INVALID_CREDENTIAL : reason,
      },
    });
  }
}
