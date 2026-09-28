import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiUnauthorizedResponse } from "@nestjs/swagger";

export function ApiInvalidOAuthStateResponse() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: "Estado OAuth inválido ou expirado.",
      type: ErrorResponseDto(
        "InvalidOAuthStateException",
        "Invalid or expired OAuth state.",
        HttpStatus.UNAUTHORIZED,
        BaseExceptionCode.INVALID_OAUTH_STATE,
      ),
    }),
  );
}
