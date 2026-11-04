import type { ApiResponseError } from "@/shared/http/http.client";
import { adminService } from "../services/admin.service";
import { useMutation } from "@tanstack/react-query";

export function useRevokeSessionMutation() {
  return useMutation<void, ApiResponseError, string>({
    mutationFn: (id) => adminService.revokeSession(id),
  });
}
