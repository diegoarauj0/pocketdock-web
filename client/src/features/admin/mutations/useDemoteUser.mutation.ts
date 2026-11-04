import type { ApiResponseError } from "@/shared/http/http.client";
import type { InterfaceAdminPublicUser } from "../services/admin.service";
import { adminService } from "../services/admin.service";
import { useMutation } from "@tanstack/react-query";

export function useDemoteUserMutation() {
  return useMutation<InterfaceAdminPublicUser, ApiResponseError, string>({
    mutationFn: (id) => adminService.demoteUser(id),
  });
}
