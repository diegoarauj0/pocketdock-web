import type {
  InterfaceAdminPaginatedResponse,
  InterfaceAdminPublicUser,
  InterfaceAdminUser,
} from "../services/admin.service";
import { adminInstancesQueryKey } from "../queries/useAdminInstances.query";
import { adminSessionsQueryKey } from "../queries/useAdminSessions.query";
import { adminUsersQueryKey } from "../queries/useAdminUsers.query";
import type { ApiResponseError } from "@/shared/http/http.client";
import { adminUserQueryKey } from "../queries/useAdminUser.query";
import { adminService } from "../services/admin.service";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

interface InterfaceDeleteUserByAdminContext {
  previousQueries: Array<[QueryKey, InterfaceAdminPaginatedResponse<InterfaceAdminUser> | undefined]>;
}

export function useDeleteUserByAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation<InterfaceAdminPublicUser, ApiResponseError, string, InterfaceDeleteUserByAdminContext>({
    mutationFn: (id) => adminService.deleteUser(id),
    onMutate: async (id) => {
      const queryKey = adminUsersQueryKey();

      await queryClient.cancelQueries({ queryKey });

      const previousQueries = queryClient.getQueriesData<InterfaceAdminPaginatedResponse<InterfaceAdminUser>>({
        queryKey,
      });

      queryClient.setQueriesData<InterfaceAdminPaginatedResponse<InterfaceAdminUser>>({ queryKey }, (oldData) => {
        if (oldData === undefined) return oldData;

        const items = oldData.items.filter((user) => user.id !== id);

        if (items.length === oldData.items.length) return oldData;

        return { ...oldData, items, total: Math.max(0, oldData.total - 1) };
      });

      return { previousQueries };
    },
    onError: (_error, _id, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: adminUserQueryKey(id) });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: adminUsersQueryKey() });
      void queryClient.invalidateQueries({ queryKey: adminInstancesQueryKey() });
      void queryClient.invalidateQueries({ queryKey: adminSessionsQueryKey() });
    },
  });
}
