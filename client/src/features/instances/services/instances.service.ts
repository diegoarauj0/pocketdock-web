import { httpService } from "@/shared/services/http.service";

export interface InterfaceInstance {
  containerName: string;
  defaultPassword: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  ID: string;
}

export type InterfaceInstanceStatus = "running" | "stopped";

interface InterfaceCalculateUsage {
  percent: number;
  limit: number;
  used: number;
}

interface InterfaceState {
  memory: InterfaceCalculateUsage;
  cpu: InterfaceCalculateUsage;
  status: InterfaceInstanceStatus;
}

export const instancesService = {
  findAllInstances: (): Promise<InterfaceInstance[]> => {
    return httpService.get("/api/instances");
  },

  createInstance: (): Promise<InterfaceInstance> => {
    return httpService.post("/api/instances", undefined);
  },

  findOneInstanceById: (ID: string): Promise<InterfaceInstance> => {
    return httpService.get(`/api/instances/${ID}`);
  },

  deleteInstance: (ID: string): Promise<InterfaceInstance> => {
    return httpService.delete(`/api/instances/${ID}`);
  },

  stopInstance: (ID: string): Promise<InterfaceInstance> => {
    return httpService.post(`/api/instances/${ID}/stop`, undefined);
  },

  startInstance: (ID: string): Promise<InterfaceInstance> => {
    return httpService.post(`/api/instances/${ID}/start`, undefined);
  },

  stats: (ID: string): Promise<InterfaceState> => {
    return httpService.get(`/api/instances/stats/${ID}`);
  },
};
