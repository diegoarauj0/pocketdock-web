import type { ApiResponseError } from "@/shared/http/http.client";
import { authService } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useLogoutAllMutation() {
  return useMutation<void, ApiResponseError>({
    mutationFn: () => authService.logoutAll(),
  });
}
