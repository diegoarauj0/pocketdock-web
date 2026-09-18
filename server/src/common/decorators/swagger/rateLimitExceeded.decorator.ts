import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { ApiTooManyRequestsResponse } from "@nestjs/swagger";
import { applyDecorators, HttpStatus } from "@nestjs/common";

export function ApiRateLimitExceededResponse() {
  return applyDecorators(
    ApiTooManyRequestsResponse({
      description: "Limite de requisições excedido.",
      type: ErrorResponseDto(
        "RateLimitException",
        "Too many requests. Please try again later.",
        HttpStatus.TOO_MANY_REQUESTS,
        BaseExceptionCode.RATE_LIMIT_EXCEEDED,
      ),
    }),
  );
}
