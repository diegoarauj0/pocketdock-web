import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiConflictResponse } from "@nestjs/swagger";

export function ApiOAuthEmailConflictResponse() {
  return applyDecorators(
    ApiConflictResponse({
      description: "Conflito entre o e-mail da conta OAuth e uma conta existente.",
      type: ErrorResponseDto(
        "OAuthEmailConflictException",
        "Cannot authenticate via OAuth due to a conflict with an existing account's email.",
        HttpStatus.CONFLICT,
        BaseExceptionCode.OAUTH_EMAIL_CONFLICT,
      ),
    }),
  );
}
