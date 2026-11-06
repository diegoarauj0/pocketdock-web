import axios, { AxiosError } from "axios";

export const ERROR_CODES = {
  INVALID_EMAIL_VERIFICATION_CODE: "INVALID_EMAIL_VERIFICATION_CODE",
  DISCRIMINATOR_CONFLICT: "DISCRIMINATOR_CONFLICT",
  OAUTH_EMAIL_CONFLICT: "OAUTH_EMAIL_CONFLICT",
  OAUTH_STRATEGY_ERROR: "OAUTH_STRATEGY_ERROR",
  INVALID_OAUTH_STATE: "INVALID_OAUTH_STATE",
  INVALID_CREDENTIAL: "INVALID_CREDENTIAL",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_SESSION: "INVALID_SESSION",
  INVALID_TOKEN: "INVALID_TOKEN",
} as const;

export type ApiErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

interface InterfaceApiResponseError {
  statusCode: number;
  timestamp: string;
  success: boolean;
  error: {
    code: ApiErrorCode;
    details: unknown;
    message: string;
  };
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class ApiResponseError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly details: unknown;

  constructor(
    message: string,
    code: ApiErrorCode,
    details: unknown,
    timestamp: string,
    statusCode: number,
    cause: Error,
  ) {
    super(message);

    this.name = "ApiResponseError";

    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.details = details;
    this.cause = cause;
    this.code = code;
  }

  public static axiosErrorToApiResponseError(axiosError: AxiosError): ApiResponseError | AxiosError {
    const body = axiosError.response?.data as InterfaceApiResponseError | undefined;
    const error = body?.error;

    if (error !== undefined && body !== undefined) {
      return new ApiResponseError(
        error.message,
        error.code,
        error.details,
        body.timestamp,
        body.statusCode,
        axiosError,
      );
    }

    return axiosError;
  }
}

httpClient.interceptors.response.use(undefined, (error: AxiosError) => {
  return Promise.reject(ApiResponseError.axiosErrorToApiResponseError(error));
});
