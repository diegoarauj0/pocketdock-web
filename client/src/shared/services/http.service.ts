import { httpClient, type ApiErrorCode } from "../http/http.client";
import type { AxiosError } from "axios";

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

interface InterfaceValidationErrorReason {
  message: string;
  code: string;
}

export interface InterfaceValidationErrorDetails {
  reasons: InterfaceValidationErrorReason[];
  value: string | number | boolean | Date;
  name: string;
}

export class ApiResponseError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly details: unknown;

  constructor(message: string, code: ApiErrorCode, details: unknown, timestamp: string, statusCode: number) {
    super(message);

    this.name = "ApiResponseError";

    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.details = details;
    this.code = code;
  }

  public static axiosErrorToApiResponseError(axiosError: AxiosError): ApiResponseError | AxiosError {
    const body = axiosError.response?.data as InterfaceApiResponseError;

    if (body.error !== undefined) {
      return new ApiResponseError(
        body.error.message,
        body.error.code,
        body.error.details,
        body.timestamp,
        body.statusCode,
      );
    }

    return axiosError;
  }
}

httpClient.interceptors.response.use(undefined, (error: AxiosError) => {
  return Promise.reject(ApiResponseError.axiosErrorToApiResponseError(error));
});

export const httpService = {
  async get<T>(url: string): Promise<T> {
    const { data } = await httpClient.get<T>(url);
    return data;
  },

  async post<TResponse, TBody>(url: string, body: TBody): Promise<TResponse> {
    const { data } = await httpClient.post<TResponse>(url, body);
    return data;
  },
};
