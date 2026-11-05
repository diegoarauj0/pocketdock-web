import type { InterfaceInstance } from "../services/instances.service";
import { QUERY_CONSTANT } from "@/shared/constants/query.constant";
import { INSTANCE_CONSTANT } from "../constants/instance.constant";
import { instancesService } from "../services/instances.service";
import { useQuery, type Query } from "@tanstack/react-query";

export function instanceQueryKey(id?: string): string[] {
  return ["instance", id || ""];
}

const getInstanceRefetchInterval = (query: Query<InterfaceInstance, Error>): number =>
  query.state.data?.status === INSTANCE_CONSTANT.STATUS.PENDING
    ? QUERY_CONSTANT.INSTANCE_DETAIL_PENDING_REFETCH_INTERVAL_MS
    : QUERY_CONSTANT.DEFAULT_REFETCH_INTERVAL_MS;

export function useInstanceQuery(id?: string | undefined) {
  return useQuery({
    queryFn: () => instancesService.findOneInstanceById(id || ""),
    queryKey: instanceQueryKey(id),
    enabled: id !== undefined,
    refetchInterval: getInstanceRefetchInterval,
  });
}
