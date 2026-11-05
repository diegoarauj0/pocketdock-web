import { QUERY_CONSTANT } from "@/shared/constants/query.constant";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ADMIN_CONSTANT } from "../admin.constant";
import { adminService } from "../services/admin.service";

export function adminSessionsQueryKey(
  page?: number,
  userId?: string,
  limit: number = ADMIN_CONSTANT.PAGE_SIZE,
): (string | number | null)[] {
  if (page === undefined) return ["admin", "sessions"];

  return ["admin", "sessions", page, userId ?? null, limit];
}

export function useAdminSessionsQuery(page: number, userId?: string, limit: number = ADMIN_CONSTANT.PAGE_SIZE) {
  return useQuery({
    queryKey: adminSessionsQueryKey(page, userId, limit),
    queryFn: () => adminService.findSessions({ limit, offset: page * limit, userId }),
    placeholderData: keepPreviousData,
    refetchInterval: QUERY_CONSTANT.DEFAULT_REFETCH_INTERVAL_MS,
  });
}
