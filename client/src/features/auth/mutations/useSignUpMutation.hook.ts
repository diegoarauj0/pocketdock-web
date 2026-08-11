import { useMutation } from "@tanstack/react-query";
import type { ApiResponseError } from "@/shared/services/http.service";
import { authService } from "../services/auth.service";
import type { InterfaceSignUpRequest } from "../services/auth.service";

export function useSignUpMutation() {
  return useMutation<void, ApiResponseError, InterfaceSignUpRequest>({
    mutationFn: authService.signUp,
  });
}
