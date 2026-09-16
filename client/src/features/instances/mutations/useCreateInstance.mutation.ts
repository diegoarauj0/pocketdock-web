import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InterfaceInstance } from "../services/instances.service";
import { instancesService } from "../services/instances.service";

interface InterfaceCreateInstanceContext {
  previousInstances: InterfaceInstance[] | undefined;
  optimisticInstance: InterfaceInstance;
}

export function useCreateInstanceMutation() {
  const queryClient = useQueryClient();

  return useMutation<InterfaceInstance, unknown, void, InterfaceCreateInstanceContext>({
    mutationFn: () => instancesService.createInstance(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["instances"] });

      const previousInstances = queryClient.getQueryData<InterfaceInstance[]>(["instances"]);

      const createdAt = new Date().toISOString();

      const optimisticInstance: InterfaceInstance = {
        ID: crypto.randomUUID(),
        containerName: "Creating instance...",
        defaultPassword: "",
        createdAt,
        updatedAt: createdAt,
        url: "",
      };

      queryClient.setQueryData<InterfaceInstance[]>(["instances"], (oldInstances = []) => [
        optimisticInstance,
        ...oldInstances,
      ]);

      return { previousInstances, optimisticInstance };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousInstances !== undefined) {
        queryClient.setQueryData(["instances"], context.previousInstances);
      }
    },
    onSuccess: (createdInstance, _variables, context) => {
      queryClient.setQueryData<InterfaceInstance[]>(["instances"], (oldInstances = []) =>
        oldInstances.map((instance) => (instance.ID === context?.optimisticInstance.ID ? createdInstance : instance)),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["instances"] });
    },
  });
}
