import { instancesService } from "../services/instances.service";
import { useQuery } from "@tanstack/react-query";

export function useStateQuery(ID?: string | undefined) {
  return useQuery({
    queryFn: () => instancesService.stats(ID || ""),
    queryKey: ["instance", "state", ID],
    enabled: ID !== undefined,
  });
}
