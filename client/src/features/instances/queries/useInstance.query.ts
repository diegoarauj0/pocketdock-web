import { instancesService } from "../services/instances.service";
import { useQuery } from "@tanstack/react-query";

export function useInstanceQuery(ID?: string | undefined) {
  return useQuery({
    queryFn: () => instancesService.findOneInstanceById(ID || ""),
    queryKey: ["instance", ID],
    enabled: ID !== undefined,
  });
}
