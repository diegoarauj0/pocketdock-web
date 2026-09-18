import { ThrottlerGuard as NestThrottlerGuard, type ThrottlerLimitDetail } from "@nestjs/throttler";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { RateLimitException } from "../exceptions/rateLimit.exception";

@Injectable()
export class CustomThrottlerGuard extends NestThrottlerGuard {
  protected throwThrottlingException(
    _context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new RateLimitException(throttlerLimitDetail.limit, throttlerLimitDetail.ttl);
  }
}
