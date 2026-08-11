import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiConflictResponse } from "@nestjs/swagger";

export function ApiConcurrentEmailVerificationResponse() {
  return applyDecorators(
    ApiConflictResponse({
      description: "Conflito ao enviar o e-mail de verificação.",
      type: ErrorResponseDto(
        "ConcurrentEmailVerificationException",
        "Conflict when sending verification email.",
        HttpStatus.CONFLICT,
        BaseExceptionCode.CONCURRENT_EMAIL_VERIFICATION,
      ),
    }),
  );
}
