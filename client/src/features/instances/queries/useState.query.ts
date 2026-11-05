import type { InterfaceState } from "../services/instances.service";
import { QUERY_CONSTANT } from "@/shared/constants/query.constant";
import { instancesService } from "../services/instances.service";
import { useQuery, type Query } from "@tanstack/react-query";

export function stateQueryKey(id?: string): string[] {
  return ["instance", "state", id || ""];
}

const getStateRefetchInterval = (query: Query<InterfaceState, Error>): number =>
  query.state.data?.status === "running"
    ? QUERY_CONSTANT.INSTANCE_STATE_REFETCH_INTERVAL_MS
    : QUERY_CONSTANT.DEFAULT_REFETCH_INTERVAL_MS;

export function useStateQuery(id?: string | undefined, enabled = true) {
  return useQuery({
    queryFn: () => instancesService.stats(id || ""),
    queryKey: stateQueryKey(id),
    enabled: id !== undefined && enabled,
    refetchInterval: getStateRefetchInterval,
  });
}
