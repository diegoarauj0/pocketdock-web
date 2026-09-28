import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiForbiddenResponse } from "@nestjs/swagger";

export function ApiInvalidTokenResponse() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: "Token de acesso inválido, ausente ou expirado.",
      type: ErrorResponseDto(
        "InvalidTokenException",
        "Invalid token.",
        HttpStatus.FORBIDDEN,
        BaseExceptionCode.INVALID_TOKEN,
      ),
    }),
  );
}
