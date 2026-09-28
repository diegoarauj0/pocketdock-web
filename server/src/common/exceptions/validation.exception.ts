import { BaseException, BaseExceptionCode } from "./base.exception";
import { ValidationError } from "class-validator";
import { HttpStatus } from "@nestjs/common";

interface InterfaceValidationReason {
  message: string;
  code: string;
}

interface InterfaceValidationDetails {
  reasons: InterfaceValidationReason[];
  value: string | number | boolean | Date;
  name: string;
}

export class ValidationException extends BaseException<InterfaceValidationDetails[]> {
  constructor(errors: ValidationError[]) {
    const details: InterfaceValidationDetails[] = [];

    for (const error of errors) {
      const reasons: InterfaceValidationReason[] = [];

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
