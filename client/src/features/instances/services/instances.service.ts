import { httpService } from "@/shared/services/http.service";

export interface InterfaceInstance {
  containerName: string;
  defaultPassword: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  id: string;
}

export type InterfaceInstanceStatus = "running" | "stopped";

interface InterfaceCalculateUsage {
  percent: number;
  limit: number;
  used: number;
}

export interface InterfaceState {
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

  findOneInstanceById: (id: string): Promise<InterfaceInstance> => {
    return httpService.get(`/api/instances/${id}`);
  },

  deleteInstance: (id: string): Promise<InterfaceInstance> => {
    return httpService.delete(`/api/instances/${id}`);
  },

  stopInstance: (id: string): Promise<InterfaceInstance> => {
    return httpService.post(`/api/instances/${id}/stop`, undefined);
  },

  startInstance: (id: string): Promise<InterfaceInstance> => {
    return httpService.post(`/api/instances/${id}/start`, undefined);
  },

  stats: (id: string): Promise<InterfaceState> => {
    return httpService.get(`/api/instances/stats/${id}`);
  },
};
