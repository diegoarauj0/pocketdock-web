import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

export class LastAdminException extends BaseException<{ reason: "LAST_ADMIN" }> {
  constructor() {
    super({
      code: BaseExceptionCode.LAST_ADMIN,
      statusCode: HttpStatus.CONFLICT,
      message: "Cannot demote the last admin.",
      details: {
        reason: "LAST_ADMIN",
      },
    });
  }
}
