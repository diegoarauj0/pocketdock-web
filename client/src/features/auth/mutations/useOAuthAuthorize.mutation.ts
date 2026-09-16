import type { ApiResponseError } from "@/shared/http/http.client";
import type { InterfaceAuthorizeResponse } from "../services/auth.service";
import { authService } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useOAuthAuthorizeMutation() {
  return useMutation<InterfaceAuthorizeResponse, ApiResponseError, string>({
    mutationFn: authService.authorize,
  });
}