import { useMutation } from "@tanstack/react-query";
import { instancesService } from "../services/instances.service";

export function useDeleteInstanceMutation() {
  return useMutation({
    mutationFn: (ID: string) => instancesService.deleteInstance(ID),
  });
}
