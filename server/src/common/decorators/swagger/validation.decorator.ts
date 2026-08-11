import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { ApiBadRequestResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export function ApiValidationResponse() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: "Campo invalid (body, params ou query).",
      type: ErrorResponseDto("ValidationErrorException", "Invalid field.", 400, BaseExceptionCode.VALIDATION_ERROR),
    }),
  );
}
