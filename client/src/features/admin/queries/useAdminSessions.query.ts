import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ADMIN_CONSTANT } from "../admin.constant";
import { adminService } from "../services/admin.service";

export function useAdminSessionsQuery(page: number, userId?: string, limit: number = ADMIN_CONSTANT.PAGE_SIZE) {
  return useQuery({
    queryKey: ["admin", "sessions", page, userId ?? null, limit],
    queryFn: () => adminService.findSessions({ limit, offset: page * limit, userId }),
    placeholderData: keepPreviousData,
  });
}
