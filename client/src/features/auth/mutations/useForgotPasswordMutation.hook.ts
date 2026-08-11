import { useMutation } from "@tanstack/react-query";
import type { ApiResponseError } from "@/shared/services/http.service";
import type { InterfaceForgotPasswordRequest } from "../services/auth.service";
import { authService } from "../services/auth.service";

export function useForgotPasswordMutation() {
  return useMutation<void, ApiResponseError, InterfaceForgotPasswordRequest>({
    mutationFn: authService.forgotPassword,
  });
}
