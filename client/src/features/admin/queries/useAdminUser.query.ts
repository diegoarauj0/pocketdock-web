import { QUERY_CONSTANT } from "@/shared/constants/query.constant";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";

export function adminUserQueryKey(id?: string): string[] {
  return ["admin", "user", id || ""];
}

export function useAdminUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: adminUserQueryKey(id),
    queryFn: () => {
      if (id === undefined) throw new Error("Admin user id is required");

      return adminService.findUserById(id);
    },
    enabled: id !== undefined && id.length > 0,
    refetchInterval: QUERY_CONSTANT.DEFAULT_REFETCH_INTERVAL_MS,
  });
}
