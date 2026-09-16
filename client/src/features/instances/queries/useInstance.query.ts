import { instancesService } from "../services/instances.service";
import { useQuery } from "@tanstack/react-query";

export function useInstanceQuery(id?: string | undefined) {
  return useQuery({
    queryFn: () => instancesService.findOneInstanceById(id || ""),
    queryKey: ["instance", id],
    enabled: id !== undefined,
  });
}
