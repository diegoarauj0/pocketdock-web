import { httpClient } from "../http/http.client";

interface InterfaceValidationErrorReason {
  message: string;
  code: string;
}

export interface InterfaceValidationErrorDetails {
  reasons: InterfaceValidationErrorReason[];
  value: string | number | boolean | Date;
  name: string;
}

export const httpService = {
  async get<T>(url: string): Promise<T> {
    const { data } = await httpClient.get(url);
    return data.data as T;
  },

  async post<TResponse, TBody>(url: string, body: TBody): Promise<TResponse> {
    const { data } = await httpClient.post(url, body);
    return data.data as TResponse;
  },

  async delete<T>(url: string): Promise<T> {
    const { data } = await httpClient.delete(url);
    return data.data as T;
  },
};
