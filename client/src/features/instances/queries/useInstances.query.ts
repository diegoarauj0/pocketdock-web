import type { InterfaceInstance } from "../services/instances.service";
import { useQuery } from "@tanstack/react-query";
import { INSTANCE_CONSTANT } from "../constants/instance.constant";
import { instancesService } from "../services/instances.service";

const PENDING_REFETCH_INTERVAL_MS = 5000;

const sortByCreatedAt = (first: InterfaceInstance, second: InterfaceInstance): number =>
  new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();

export function useInstancesQuery() {
  return useQuery({
    queryFn: instancesService.findAllInstances,
    queryKey: ["instances"],
    select: (instances) => [...instances].sort(sortByCreatedAt),
    refetchInterval: (query) =>
      query.state.data?.some((instance) => instance.status === INSTANCE_CONSTANT.STATUS.PENDING)
        ? PENDING_REFETCH_INTERVAL_MS
        : false,
  });
}
