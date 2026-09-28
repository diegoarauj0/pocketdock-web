import { useMutation } from "@tanstack/react-query";
import type { ApiResponseError } from "@/shared/http/http.client";
import type { InterfaceVerifyEmailRequest } from "../services/auth.service";
import { authService } from "../services/auth.service";

export function useForgotPasswordVerifyMutation() {
  return useMutation<void, ApiResponseError, InterfaceVerifyEmailRequest>({
    mutationFn: authService.forgotPasswordVerifyEmail,
  });
}
