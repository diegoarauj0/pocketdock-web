import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBadRequestResponse } from "@nestjs/swagger";

export function ApiInvalidEmailVerificationCodeResponse() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: "Código de validação errado.",
      type: ErrorResponseDto(
        "InvalidEmailVerificationCodeException",
        "Invalid code.",
        HttpStatus.BAD_REQUEST,
        BaseExceptionCode.INVALID_EMAIL_VERIFICATION_CODE,
      ),
    }),
  );
}
