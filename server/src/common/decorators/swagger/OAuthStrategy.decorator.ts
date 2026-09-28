import { BaseExceptionCode } from "src/common/exceptions/base.exception";
import { ErrorResponseDto } from "src/common/dtos/errorResponse.dto";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBadGatewayResponse } from "@nestjs/swagger";

export function ApiOAuthStrategyErrorResponse() {
  return applyDecorators(
    ApiBadGatewayResponse({
      description: "Falha ao se comunicar com o provedor OAuth.",
      type: ErrorResponseDto(
        "OAuthStrategyException",
        "Failed to communicate with OAuth strategy.",
        HttpStatus.BAD_GATEWAY,
        BaseExceptionCode.OAUTH_STRATEGY_ERROR,
      ),
    }),
  );
}
