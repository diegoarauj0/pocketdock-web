import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";

export function useAdminUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => {
      if (id === undefined) throw new Error("Admin user id is required");

      return adminService.findUserById(id);
    },
    enabled: id !== undefined && id.length > 0,
  });
}
