import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ADMIN_CONSTANT } from "../admin.constant";
import { adminService } from "../services/admin.service";

export function useAdminUsersQuery(page: number) {
  const limit = ADMIN_CONSTANT.PAGE_SIZE;

  return useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => adminService.findUsers({ limit, offset: page * limit }),
    placeholderData: keepPreviousData,
  });
}
