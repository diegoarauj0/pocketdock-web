import { useQuery } from "@tanstack/react-query";
import { instancesService } from "../services/instances.service";

export function useInstancesQuery() {
  return useQuery({
    queryFn: instancesService.findAllInstances,
    queryKey: ["instances"],
  });
}
