import type { InterfaceInstance, InterfaceState } from "../services/instances.service";
import { instanceQueryKey } from "../queries/useInstance.query";
import { stateQueryKey } from "../queries/useState.query";
import { instancesService } from "../services/instances.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface InterfaceStartInstanceContext {
  previousInstance: InterfaceInstance | undefined;
  previousState: InterfaceState | undefined;
}

export function useStartInstanceMutation() {
  const queryClient = useQueryClient();

  return useMutation<InterfaceInstance, unknown, string, InterfaceStartInstanceContext>({
    mutationFn: (id) => instancesService.startInstance(id),
    onMutate: async (id) => {
      const instanceKey = instanceQueryKey(id);
      const stateKey = stateQueryKey(id);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: instanceKey }),
        queryClient.cancelQueries({ queryKey: stateKey }),
      ]);

      const previousInstance = queryClient.getQueryData<InterfaceInstance>(instanceKey);
      const previousState = queryClient.getQueryData<InterfaceState>(stateKey);

      queryClient.setQueryData<InterfaceState>(stateKey, (oldState) =>
        oldState === undefined ? oldState : { ...oldState, status: "running" },
      );

      return { previousInstance, previousState };
    },
    onError: (_error, id, context) => {
      if (context?.previousInstance !== undefined) {
        queryClient.setQueryData(instanceQueryKey(id), context.previousInstance);
      }

      if (context?.previousState !== undefined) {
        queryClient.setQueryData(stateQueryKey(id), context.previousState);
      }
    },
    onSuccess: (instance, id) => {
      queryClient.setQueryData(instanceQueryKey(id), instance);
    },
    onSettled: (_data, _error, id) => {
      void queryClient.invalidateQueries({ queryKey: instanceQueryKey(id) });
      void queryClient.invalidateQueries({ queryKey: stateQueryKey(id) });
    },
  });
}
