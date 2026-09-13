import { httpService } from "@/shared/services/http.service";

export interface InterfaceInstance {
  containerName: string;
  updatedAt: string;
  createdAt: string;
  ID: string;
}

interface InterfaceCalculateUsage {
  percent: number;
  limit: number;
  used: number;
}

interface InterfaceState {
  memory: InterfaceCalculateUsage;
  cpu: InterfaceCalculateUsage;
}

export const instancesService = {
  findAllInstances: (): Promise<InterfaceInstance[]> => {
    return httpService.get("/api/instances");
  },

  findOneInstanceById: (ID: string): Promise<InterfaceInstance> => {
    return httpService.get(`/api/instances/${ID}`);
  },

  stats: (ID: string): Promise<InterfaceState> => {
    return httpService.get(`/api/instances/stats/${ID}`);
  },
};
