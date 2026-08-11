import { useMutation } from "@tanstack/react-query";
import type { ApiResponseError } from "@/shared/services/http.service";
import type { InterfaceEmailRequest } from "../services/auth.service";
import { authService } from "../services/auth.service";

export function useSignUpResendMutation() {
  return useMutation<void, ApiResponseError, InterfaceEmailRequest>({
    mutationFn: authService.signUpResendEmail,
  });
}
