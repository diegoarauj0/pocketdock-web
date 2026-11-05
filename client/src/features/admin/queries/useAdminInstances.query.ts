import { QUERY_CONSTANT } from "@/shared/constants/query.constant";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ADMIN_CONSTANT } from "../admin.constant";
import { adminService } from "../services/admin.service";

export function adminInstancesQueryKey(
  page?: number,
  userId?: string,
  limit: number = ADMIN_CONSTANT.PAGE_SIZE,
): (string | number | null)[] {
  if (page === undefined) return ["admin", "instances"];

  return ["admin", "instances", page, userId ?? null, limit];
}

export function useAdminInstancesQuery(page: number, userId?: string, limit: number = ADMIN_CONSTANT.PAGE_SIZE) {
  return useQuery({
    queryKey: adminInstancesQueryKey(page, userId, limit),
    queryFn: () => adminService.findInstances({ limit, offset: page * limit, userId }),
    placeholderData: keepPreviousData,
    refetchInterval: QUERY_CONSTANT.DEFAULT_REFETCH_INTERVAL_MS,
  });
}
