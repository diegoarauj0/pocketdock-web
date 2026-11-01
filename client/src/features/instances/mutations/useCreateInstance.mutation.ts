import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InterfaceInstance } from "../services/instances.service";
import { useTranslation } from "react-i18next";
import { instancesService } from "../services/instances.service";
import { INSTANCE_CONSTANT } from "../constants/instance.constant";

interface InterfaceCreateInstanceContext {
  previousInstances: InterfaceInstance[] | undefined;
  optimisticInstance: InterfaceInstance;
}

export function useCreateInstanceMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("instances");

  return useMutation<InterfaceInstance, unknown, void, InterfaceCreateInstanceContext>({
    mutationFn: () => instancesService.createInstance(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["instances"] });

      const previousInstances = queryClient.getQueryData<InterfaceInstance[]>(["instances"]);

      const createdAt = new Date().toISOString();

      const optimisticInstance: InterfaceInstance = {
        id: crypto.randomUUID(),
        containerName: t("INSTANCE_CREATING_PLACEHOLDER"),
        defaultPassword: "",
        status: INSTANCE_CONSTANT.STATUS.PENDING,
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
        oldInstances.map((instance) => (instance.id === context?.optimisticInstance.id ? createdInstance : instance)),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["instances"] });
    },
  });
}
