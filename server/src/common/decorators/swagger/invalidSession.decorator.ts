import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiUnauthorizedResponse } from "@nestjs/swagger";

export function ApiInvalidSessionResponse() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: "Sessão inválida.",
      type: ErrorResponseDto(
        "InvalidSessionException",
        "Invalid session.",
        HttpStatus.UNAUTHORIZED,
        BaseExceptionCode.INVALID_SESSION,
      ),
    }),
  );
}
