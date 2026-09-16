import { useMutation } from "@tanstack/react-query";
import { instancesService } from "../services/instances.service";

export function useStopInstanceMutation() {
  return useMutation({
    mutationFn: (ID: string) => instancesService.stopInstance(ID),
  });
}
