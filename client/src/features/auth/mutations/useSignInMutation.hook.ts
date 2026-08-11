import type { InterfaceSignInRequest, InterfaceTokenResponse } from "../services/auth.service";
import type { ApiResponseError } from "@/shared/services/http.service";
import { authService } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useSignInMutation() {
  return useMutation<InterfaceTokenResponse, ApiResponseError, InterfaceSignInRequest>({
    mutationFn: authService.signIn,
  });
}
