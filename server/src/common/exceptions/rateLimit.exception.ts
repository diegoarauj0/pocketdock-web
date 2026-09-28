import { BaseException, BaseExceptionCode } from "./base.exception";
import { HttpStatus } from "@nestjs/common";

export class RateLimitException extends BaseException<{ limit: number; ttl: number }> {
  constructor(limit: number, ttl: number) {
    super({
      code: BaseExceptionCode.RATE_LIMIT_EXCEEDED,
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message: "Too many requests. Please try again later.",
      details: { limit, ttl },
    });
  }
}
