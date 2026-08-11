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

export interface InterfaceTokenResponse {
  access: string;
  expiresIn: number;
}

export interface InterfaceVerifyEmailRequest {
  email: string;
  code: string;
}

export const authService = {
  forgotPassword: (request: InterfaceForgotPasswordRequest): Promise<void> =>
    httpService.post<void, InterfaceForgotPasswordRequest>("/api/auth/forgotPassword", request),

  forgotPasswordResendEmail: (request: InterfaceEmailRequest): Promise<void> =>
    httpService.post<void, InterfaceEmailRequest>("/api/auth/forgotPassword/resend", request),

  forgotPasswordVerifyEmail: (request: InterfaceVerifyEmailRequest): Promise<void> =>
    httpService.post<void, InterfaceVerifyEmailRequest>("/api/auth/forgotPassword/verify", request),

  signIn: (request: InterfaceSignInRequest): Promise<InterfaceTokenResponse> =>
    httpService.post<InterfaceTokenResponse, InterfaceSignInRequest>("/api/auth/signIn", request),

  signUp: (request: InterfaceSignUpRequest): Promise<void> =>
    httpService.post<void, InterfaceSignUpRequest>("/api/auth/signUp", request),

  signUpResendEmail: (request: InterfaceEmailRequest): Promise<void> =>
    httpService.post<void, InterfaceEmailRequest>("/api/auth/signUp/resend", request),

  signUpVerifyEmail: (request: InterfaceVerifyEmailRequest): Promise<InterfaceTokenResponse> =>
    httpService.post<InterfaceTokenResponse, InterfaceVerifyEmailRequest>("/api/auth/signUp/verify", request),
};
