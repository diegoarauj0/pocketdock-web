import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

export class InstanceNotFoundException extends BaseException<{ reason: "NOT_FOUND" }> {
  constructor() {
    super({
      code: BaseExceptionCode.INSTANCE_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
      message: "Instance not found.",
      details: {
        reason: "NOT_FOUND",
      },
    });
  }
}
