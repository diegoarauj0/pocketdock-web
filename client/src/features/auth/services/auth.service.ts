import type { InterfacePublicUser } from "@/features/users/services/users.service";
import { httpService } from "@/shared/services/http.service";

export interface InterfaceEmailRequest {
  email: string;
}

export interface InterfaceForgotPasswordRequest {
  password: string;
  email: string;
}

export interface InterfaceSignInRequest {
  password: string;
  email: string;
}

export interface InterfaceSignUpRequest {
  password: string;
  username: string;
  email: string;
}

export interface InterfaceAuthorizeResponse {
  authorizeURL: string;
  strategyID: string;
}

export interface InterfaceTokenResponse {
  access: string;
  expiresIn: number;
}

export interface InterfaceVerifyEmailRequest {
  email: string;
  code: string;
}

export const authService = {
  forgotPassword: (request: InterfaceForgotPasswordRequest): Promise<void> => {
    return httpService.post<void, InterfaceForgotPasswordRequest>("/api/auth/forgot-password", request);
  },

  forgotPasswordResendEmail: (request: InterfaceEmailRequest): Promise<void> => {
    return httpService.post<void, InterfaceEmailRequest>("/api/auth/forgot-password/resend", request);
  },

  forgotPasswordVerifyEmail: (request: InterfaceVerifyEmailRequest): Promise<void> => {
    return httpService.post<void, InterfaceVerifyEmailRequest>("/api/auth/forgot-password/verify", request);
  },

  me: (): Promise<InterfacePublicUser> => {
    return httpService.get<InterfacePublicUser>("/api/auth/me");
  },

  authorize: (strategyID: string): Promise<InterfaceAuthorizeResponse> => {
    return httpService.post<InterfaceAuthorizeResponse, undefined>(`/api/oauth/authorize/${strategyID}`, undefined);
  },

  refresh: (): Promise<InterfaceTokenResponse> => {
    return httpService.post<InterfaceTokenResponse, undefined>("/api/auth/refresh", undefined);
  },

  signIn: (request: InterfaceSignInRequest): Promise<InterfaceTokenResponse> => {
    return httpService.post<InterfaceTokenResponse, InterfaceSignInRequest>("/api/auth/sign-in", request);
  },

  logout: (): Promise<void> => {
    return httpService.post("/api/auth/logout", undefined);
  },

  signUp: (request: InterfaceSignUpRequest): Promise<void> => {
    return httpService.post<void, InterfaceSignUpRequest>("/api/auth/sign-up", request);
  },

  signUpResendEmail: (request: InterfaceEmailRequest): Promise<void> => {
    return httpService.post<void, InterfaceEmailRequest>("/api/auth/sign-up/resend", request);
  },

  signUpVerifyEmail: (request: InterfaceVerifyEmailRequest): Promise<InterfaceTokenResponse> => {
    return httpService.post<InterfaceTokenResponse, InterfaceVerifyEmailRequest>("/api/auth/sign-up/verify", request);
  },
};
