import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiUnauthorizedResponse } from "@nestjs/swagger";

export function ApiInvalidCredentialResponse() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: "Credenciais inválidas.",
      type: ErrorResponseDto(
        "InvalidCredentialException",
        "Invalid credential.",
        HttpStatus.UNAUTHORIZED,
        BaseExceptionCode.INVALID_CREDENTIAL,
      ),
    }),
  );
}
