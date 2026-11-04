import type { ApiResponseError } from "@/shared/http/http.client";
import type { InterfaceAdminPublicUser } from "../services/admin.service";
import { adminService } from "../services/admin.service";
import { useMutation } from "@tanstack/react-query";

export function useDeleteUserMutation() {
  return useMutation<InterfaceAdminPublicUser, ApiResponseError, string>({
    mutationFn: (id) => adminService.deleteUser(id),
  });
}
