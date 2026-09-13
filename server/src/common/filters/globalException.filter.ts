import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { BaseException } from "../exceptions/base.exception";
import type { Request, Response } from "express";
import { env } from "src/config/env";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  public catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    let error: { code: string | null; message: string | null; details: unknown } = {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
      details: null,
    };

    if (exception instanceof BaseException) {
      statusCode = exception.statusCode;

      if (exception.actions.clearAuthenticationCookie) {
        response.clearCookie("refresh", {
          secure: env.NODE_ENV === "production",
          path: "/api/auth/refresh",
          sameSite: "lax",
          httpOnly: true,
        });
      }

      error = {
        code: exception.code,
        message: exception.message,
        details: exception.details as unknown,
      };
    }

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        error.message = exceptionResponse;
      }

      if (typeof exceptionResponse === "object") {
        const res = exceptionResponse as {
          message?: string;
          error?: string;
        };

        error = {
          code: res?.error ?? "INTERNAL_SERVER_ERROR",
          message: res.message ?? res?.message ?? "An unexpected error occurred.",
          details: null,
        };
      }
    }

    const method = request.method;
    const path = request.path;

    if (Number(statusCode) >= 500) {
      this.logger.error(
        `${method} ${path} → ${error.message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    if (Number(statusCode) < 500 && env.NODE_ENV === "development") {
      this.logger.warn(
        `${method} ${path} → ${error.message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(statusCode).json({ success: false, statusCode, error: error, timestamp: new Date().toISOString() });
  }
}
