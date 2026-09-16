import type { ApiResponseError } from "@/shared/http/http.client";
import type { InterfaceSignInRequest, InterfaceTokenResponse } from "../services/auth.service";
import { authService } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useSignInMutation() {
  return useMutation<InterfaceTokenResponse, ApiResponseError, InterfaceSignInRequest>({
    mutationFn: authService.signIn,
  });
}
