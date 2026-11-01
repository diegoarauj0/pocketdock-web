import { INSTANCE_CONSTANT } from "../constants/instance.constant";
import { instancesService } from "../services/instances.service";
import { useQuery } from "@tanstack/react-query";

const PENDING_REFETCH_INTERVAL_MS = 2500;

export function useInstanceQuery(id?: string | undefined) {
  return useQuery({
    queryFn: () => instancesService.findOneInstanceById(id || ""),
    queryKey: ["instance", id],
    enabled: id !== undefined,
    refetchInterval: (query) =>
      query.state.data?.status === INSTANCE_CONSTANT.STATUS.PENDING ? PENDING_REFETCH_INTERVAL_MS : false,
  });
}
