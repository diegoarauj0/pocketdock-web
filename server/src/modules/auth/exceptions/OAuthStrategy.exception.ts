import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { OAuthStrategyID } from "../strategies/base.strategy";
import { HttpStatus } from "@nestjs/common";

export enum OAuthStrategyErrorReason {
  INVALID_PROVIDER_RESPONSE = "INVALID_PROVIDER_RESPONSE",
  USER_INFO_FETCH_FAILED = "USER_INFO_FETCH_FAILED",
  TOKEN_EXCHANGE_FAILED = "TOKEN_EXCHANGE_FAILED",
  UNVERIFIED_EMAIL = "UNVERIFIED_EMAIL",
}

export class OAuthStrategyException extends BaseException<{
  strategyID: OAuthStrategyID;
  reason: OAuthStrategyErrorReason;
}> {
  constructor(strategyID: OAuthStrategyID, reason: OAuthStrategyErrorReason) {
    super({
      code: BaseExceptionCode.OAUTH_STRATEGY_ERROR,
      statusCode: HttpStatus.BAD_GATEWAY,
      message: `Failed to communicate with OAuth strategy "${strategyID}".`,
      details: {
        strategyID: strategyID,
        reason: reason,
      },
    });
  }
}
