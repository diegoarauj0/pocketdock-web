import { useMutation } from "@tanstack/react-query";
import { instancesService } from "../services/instances.service";

export function useStartInstanceMutation() {
  return useMutation({
    mutationFn: (ID: string) => instancesService.startInstance(ID),
  });
}
