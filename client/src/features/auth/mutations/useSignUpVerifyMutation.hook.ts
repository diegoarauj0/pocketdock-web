import { useMutation } from "@tanstack/react-query";
import type { ApiResponseError } from "@/shared/http/http.client";
import type { InterfaceVerifyEmailRequest, InterfaceTokenResponse } from "../services/auth.service";
import { authService } from "../services/auth.service";

export function useSignUpVerifyMutation() {
  return useMutation<InterfaceTokenResponse, ApiResponseError, InterfaceVerifyEmailRequest>({
    mutationFn: authService.signUpVerifyEmail,
  });
}
