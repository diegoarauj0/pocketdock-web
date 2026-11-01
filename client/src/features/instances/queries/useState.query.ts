import { instancesService } from "../services/instances.service";
import { useQuery } from "@tanstack/react-query";

export function useStateQuery(id?: string | undefined, enabled = true) {
  return useQuery({
    queryFn: () => instancesService.stats(id || ""),
    queryKey: ["instance", "state", id],
    enabled: id !== undefined && enabled,
  });
}
