import type { InterfaceAdminInstance, InterfaceAdminPaginatedResponse } from "../services/admin.service";
import type { ApiResponseError } from "@/shared/http/http.client";
import { adminInstancesQueryKey } from "../queries/useAdminInstances.query";
import { adminService } from "../services/admin.service";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

interface InterfaceDeleteInstanceByAdminContext {
  previousQueries: Array<[QueryKey, InterfaceAdminPaginatedResponse<InterfaceAdminInstance> | undefined]>;
}

export function useDeleteInstanceByAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation<InterfaceAdminInstance, ApiResponseError, string, InterfaceDeleteInstanceByAdminContext>({
    mutationFn: (id) => adminService.deleteInstance(id),
    onMutate: async (id) => {
      const queryKey = adminInstancesQueryKey();

      await queryClient.cancelQueries({ queryKey });

      const previousQueries = queryClient.getQueriesData<InterfaceAdminPaginatedResponse<InterfaceAdminInstance>>({
        queryKey,
      });

      queryClient.setQueriesData<InterfaceAdminPaginatedResponse<InterfaceAdminInstance>>({ queryKey }, (oldData) => {
        if (oldData === undefined) return oldData;

        const items = oldData.items.filter((instance) => instance.id !== id);

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
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: adminInstancesQueryKey() });
    },
  });
}
