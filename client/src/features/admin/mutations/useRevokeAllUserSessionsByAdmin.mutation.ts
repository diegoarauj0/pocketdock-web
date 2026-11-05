import type { InterfaceAdminPaginatedResponse, InterfaceAdminSession } from "../services/admin.service";
import type { ApiResponseError } from "@/shared/http/http.client";
import { adminSessionsQueryKey } from "../queries/useAdminSessions.query";
import { adminService } from "../services/admin.service";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

interface InterfaceRevokeAllUserSessionsByAdminContext {
  previousQueries: Array<[QueryKey, InterfaceAdminPaginatedResponse<InterfaceAdminSession> | undefined]>;
}

export function useRevokeAllUserSessionsByAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiResponseError, string, InterfaceRevokeAllUserSessionsByAdminContext>({
    mutationFn: (userId) => adminService.revokeAllUserSessions(userId),
    onMutate: async (userId) => {
      const queryKey = adminSessionsQueryKey();

      await queryClient.cancelQueries({ queryKey });

      const previousQueries =
        queryClient.getQueriesData<InterfaceAdminPaginatedResponse<InterfaceAdminSession>>({ queryKey });

      const revokedAt = new Date().toISOString();

      queryClient.setQueriesData<InterfaceAdminPaginatedResponse<InterfaceAdminSession>>(
        { queryKey },
        (oldData) => {
          if (oldData === undefined) return oldData;

          let changed = false;

          const items = oldData.items.map((session) => {
            if (session.userId !== userId || session.revoked) return session;

            changed = true;

            return { ...session, revoked: true, revokedAt, revokeType: "ADMIN" as const, updatedAt: revokedAt };
          });

          return changed ? { ...oldData, items } : oldData;
        },
      );

      return { previousQueries };
    },
    onError: (_error, _userId, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: adminSessionsQueryKey() });
    },
  });
}
