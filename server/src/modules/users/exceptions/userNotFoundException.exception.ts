import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends BaseException<{ reason: "NOT_FOUND" }> {
  constructor() {
    super({
      code: BaseExceptionCode.USER_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
      message: "User not found.",
      details: {
        reason: "NOT_FOUND",
      },
    });
  }
}
