import type { ApiResponseError } from "@/shared/http/http.client";
import { adminService } from "../services/admin.service";
import { useMutation } from "@tanstack/react-query";

export function useRevokeAllUserSessionsMutation() {
  return useMutation<void, ApiResponseError, string>({
    mutationFn: (userId) => adminService.revokeAllUserSessions(userId),
  });
}
