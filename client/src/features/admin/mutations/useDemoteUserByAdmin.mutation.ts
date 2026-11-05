import type {
  InterfaceAdminPaginatedResponse,
  InterfaceAdminPublicUser,
  InterfaceAdminUser,
} from "../services/admin.service";
import type { ApiResponseError } from "@/shared/http/http.client";
import { adminUsersQueryKey } from "../queries/useAdminUsers.query";
import { adminUserQueryKey } from "../queries/useAdminUser.query";
import { adminService } from "../services/admin.service";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

interface InterfaceDemoteUserByAdminContext {
  previousUser: InterfaceAdminUser | undefined;
  previousQueries: Array<[QueryKey, InterfaceAdminPaginatedResponse<InterfaceAdminUser> | undefined]>;
}

export function useDemoteUserByAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation<InterfaceAdminPublicUser, ApiResponseError, string, InterfaceDemoteUserByAdminContext>({
    mutationFn: (id) => adminService.demoteUser(id),
    onMutate: async (id) => {
      const userQueryKey = adminUserQueryKey(id);
      const usersQueryKey = adminUsersQueryKey();

      await Promise.all([
        queryClient.cancelQueries({ queryKey: userQueryKey }),
        queryClient.cancelQueries({ queryKey: usersQueryKey }),
      ]);

      const previousUser = queryClient.getQueryData<InterfaceAdminUser>(userQueryKey);
      const previousQueries =
        queryClient.getQueriesData<InterfaceAdminPaginatedResponse<InterfaceAdminUser>>({ queryKey: usersQueryKey });

      queryClient.setQueryData<InterfaceAdminUser>(userQueryKey, (oldUser) =>
        oldUser === undefined ? oldUser : { ...oldUser, isAdmin: false },
      );

      queryClient.setQueriesData<InterfaceAdminPaginatedResponse<InterfaceAdminUser>>(
        { queryKey: usersQueryKey },
        (oldData) => {
          if (oldData === undefined) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((user) => (user.id === id ? { ...user, isAdmin: false } : user)),
          };
        },
      );

      return { previousUser, previousQueries };
    },
    onError: (_error, id, context) => {
      if (context?.previousUser !== undefined) {
        queryClient.setQueryData(adminUserQueryKey(id), context.previousUser);
      }

      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: (user, id) => {
      queryClient.setQueryData<InterfaceAdminUser>(adminUserQueryKey(id), (oldUser) =>
        oldUser === undefined ? oldUser : { ...oldUser, ...user },
      );
    },
    onSettled: (_data, _error, id) => {
      void queryClient.invalidateQueries({ queryKey: adminUserQueryKey(id) });
      void queryClient.invalidateQueries({ queryKey: adminUsersQueryKey() });
    },
  });
}
