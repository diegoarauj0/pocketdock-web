import { ValidationError } from "class-validator";
import { BaseException, BaseExceptionCode } from "./base.exception";
import { HttpStatus } from "@nestjs/common";

interface InterfaceValidationErrorReason {
  message: string;
  code: string;
}

interface InterfaceValidationErrorDetails {
  reasons: InterfaceValidationErrorReason[];
  value: string | number | boolean | Date;
  name: string;
}

export class ValidationErrorException extends BaseException<InterfaceValidationErrorDetails[]> {
  constructor(errors: ValidationError[]) {
    const details: InterfaceValidationErrorDetails[] = [];

    for (const error of errors) {
      const reasons: InterfaceValidationErrorReason[] = [];

      for (const constraint in error.constraints) {
        reasons.push({ code: constraint, message: error.constraints[constraint] });
      }

      details.push({ name: error.property, value: error.value as string, reasons });
    }

    super({
      message: "Invalid field.",
      code: BaseExceptionCode.VALIDATION_ERROR,
      statusCode: HttpStatus.BAD_REQUEST,
      details: details,
    });
  }
}
