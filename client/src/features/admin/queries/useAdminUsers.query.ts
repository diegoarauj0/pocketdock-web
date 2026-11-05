import { QUERY_CONSTANT } from "@/shared/constants/query.constant";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ADMIN_CONSTANT } from "../admin.constant";
import { adminService } from "../services/admin.service";

export function adminUsersQueryKey(page?: number): (string | number)[] {
  return page === undefined ? ["admin", "users"] : ["admin", "users", page];
}

export function useAdminUsersQuery(page: number) {
  const limit = ADMIN_CONSTANT.PAGE_SIZE;

  return useQuery({
    queryKey: adminUsersQueryKey(page),
    queryFn: () => adminService.findUsers({ limit, offset: page * limit }),
    placeholderData: keepPreviousData,
    refetchInterval: QUERY_CONSTANT.DEFAULT_REFETCH_INTERVAL_MS,
  });
}
