import { HttpException, HttpStatus } from "@nestjs/common";

export enum BaseExceptionCode {
  INVALID_EMAIL_VERIFICATION_CODE = "INVALID_EMAIL_VERIFICATION_CODE",
  CONCURRENT_EMAIL_VERIFICATION = "CONCURRENT_EMAIL_VERIFICATION",
  OAUTH_STRATEGY_ERROR = "OAUTH_STRATEGY_ERROR",
  OAUTH_EMAIL_CONFLICT = "OAUTH_EMAIL_CONFLICT",
  INVALID_OAUTH_STATE = "INVALID_OAUTH_STATE",
  INVALID_CREDENTIAL = "INVALID_CREDENTIAL",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_SESSION = "INVALID_SESSION",
  INVALID_TOKEN = "INVALID_TOKEN",
  INSTANCE_NOT_FOUND = "INSTANCE_NOT_FOUND",
  INSTANCE_CONTAINER_ERROR = "INSTANCE_CONTAINER_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
}

interface InterfaceExceptionActions {
  clearAuthenticationCookie?: boolean;
}

interface InterfaceBaseException<Details = unknown> {
  actions?: InterfaceExceptionActions;
  code: BaseExceptionCode;
  statusCode: HttpStatus;
  details: Details;
  message: string;
}

export class BaseException<Details extends Record<string, any> | undefined> extends HttpException {
  public readonly actions: InterfaceExceptionActions;
  public readonly code: BaseExceptionCode;
  public readonly statusCode: HttpStatus;
  public readonly details: Details;

  constructor(props: InterfaceBaseException<Details>) {
    const { statusCode, message, code, details, actions } = props;

    super(message, statusCode);

    this.code = code;
    this.details = details;
    this.actions = actions || {};
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
