import { useMutation } from "@tanstack/react-query";
import { instancesService } from "../services/instances.service";

export function useStopInstanceMutation() {
  return useMutation({
    mutationFn: (id: string) => instancesService.stopInstance(id),
  });
}
