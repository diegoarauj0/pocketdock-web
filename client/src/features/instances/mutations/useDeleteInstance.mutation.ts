import type { InterfaceInstance } from "../services/instances.service";
import { instanceQueryKey } from "../queries/useInstance.query";
import { instancesQueryKey } from "../queries/useInstances.query";
import { stateQueryKey } from "../queries/useState.query";
import { instancesService } from "../services/instances.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface InterfaceDeleteInstanceContext {
  previousInstances: InterfaceInstance[] | undefined;
}

export function useDeleteInstanceMutation() {
  const queryClient = useQueryClient();

  return useMutation<InterfaceInstance, unknown, string, InterfaceDeleteInstanceContext>({
    mutationFn: (id) => instancesService.deleteInstance(id),
    onMutate: async (id) => {
      const queryKey = instancesQueryKey();

      await queryClient.cancelQueries({ queryKey });

      const previousInstances = queryClient.getQueryData<InterfaceInstance[]>(queryKey);

      queryClient.setQueryData<InterfaceInstance[]>(queryKey, (oldInstances = []) =>
        oldInstances.filter((instance) => instance.id !== id),
      );

      return { previousInstances };
    },
    onError: (_error, _id, context) => {
      if (context?.previousInstances !== undefined) {
        queryClient.setQueryData(instancesQueryKey(), context.previousInstances);
      }
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: instanceQueryKey(id) });
      queryClient.removeQueries({ queryKey: stateQueryKey(id) });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: instancesQueryKey() });
    },
  });
}
