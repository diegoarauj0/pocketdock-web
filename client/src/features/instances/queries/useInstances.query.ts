import type { InterfaceInstance } from "../services/instances.service";
import { QUERY_CONSTANT } from "@/shared/constants/query.constant";
import { useQuery, type Query } from "@tanstack/react-query";
import { INSTANCE_CONSTANT } from "../constants/instance.constant";
import { instancesService } from "../services/instances.service";

const sortByCreatedAt = (first: InterfaceInstance, second: InterfaceInstance): number =>
  new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();

export function instancesQueryKey(): string[] {
  return ["instances"];
}

const getInstancesRefetchInterval = (query: Query<InterfaceInstance[], Error>): number =>
  query.state.data?.some((instance) => instance.status === INSTANCE_CONSTANT.STATUS.PENDING)
    ? QUERY_CONSTANT.INSTANCE_PENDING_REFETCH_INTERVAL_MS
    : QUERY_CONSTANT.DEFAULT_REFETCH_INTERVAL_MS;

export function useInstancesQuery() {
  return useQuery({
    queryFn: instancesService.findAllInstances,
    queryKey: instancesQueryKey(),
    select: (instances) => [...instances].sort(sortByCreatedAt),
    refetchInterval: getInstancesRefetchInterval,
  });
}
