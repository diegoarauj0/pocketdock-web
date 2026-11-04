import type { ApiResponseError } from "@/shared/http/http.client";
import type { InterfaceAdminInstance } from "../services/admin.service";
import { adminService } from "../services/admin.service";
import { useMutation } from "@tanstack/react-query";

export function useDeleteInstanceMutation() {
  return useMutation<InterfaceAdminInstance, ApiResponseError, string>({
    mutationFn: (id) => adminService.deleteInstance(id),
  });
}
