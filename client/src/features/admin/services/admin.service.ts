import type { InterfaceInstanceLifecycleStatus } from "@/features/instances/services/instances.service";
import { httpService } from "@/shared/services/http.service";

export interface InterfaceAdminUserSummary {
  id: string;
  username: string;
  email: string;
}

export interface InterfaceAdminUser extends InterfaceAdminUserSummary {
  emailVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterfaceAdminPublicUser {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterfaceAdminInstance {
  id: string;
  userId: string;
  user: InterfaceAdminUserSummary;
  status: InterfaceInstanceLifecycleStatus;
  containerName: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminSessionRevokeType = "TOKEN_REUSE" | "LOGOUT_ALL" | "EXPIRED" | "LOGOUT" | "ADMIN";

export interface InterfaceAdminSession {
  id: string;
  userId: string;
  user: InterfaceAdminUserSummary;
  expiresAt: string;
  revoked: boolean;
  revokedAt: string | null;
  revokeType: AdminSessionRevokeType | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterfaceAdminPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface InterfaceAdminPaginationParams {
  limit: number;
  offset: number;
}

export interface InterfaceAdminFilteredPaginationParams extends InterfaceAdminPaginationParams {
  userId?: string;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });

  const query = searchParams.toString();

  return query.length > 0 ? `?${query}` : "";
}

export const adminService = {
  findUsers: (params: InterfaceAdminPaginationParams): Promise<InterfaceAdminPaginatedResponse<InterfaceAdminUser>> => {
    return httpService.get(`/api/admin/users${buildQuery({ ...params })}`);
  },

  findUserById: (id: string): Promise<InterfaceAdminUser> => {
    return httpService.get(`/api/admin/users/${id}`);
  },

  promoteUser: (id: string): Promise<InterfaceAdminPublicUser> => {
    return httpService.post(`/api/admin/users/${id}/promote`, undefined);
  },

  demoteUser: (id: string): Promise<InterfaceAdminPublicUser> => {
    return httpService.post(`/api/admin/users/${id}/demote`, undefined);
  },

  deleteUser: (id: string): Promise<InterfaceAdminPublicUser> => {
    return httpService.delete<InterfaceAdminPublicUser>(`/api/admin/users/${id}`);
  },

  revokeSession: (id: string): Promise<void> => {
    return httpService.post<void, undefined>(`/api/admin/sessions/${id}/revoke`, undefined);
  },

  revokeAllUserSessions: (userId: string): Promise<void> => {
    return httpService.post<void, undefined>(`/api/admin/users/${userId}/sessions/revoke-all`, undefined);
  },

  findInstances: (
    params: InterfaceAdminFilteredPaginationParams,
  ): Promise<InterfaceAdminPaginatedResponse<InterfaceAdminInstance>> => {
    return httpService.get(`/api/admin/instances${buildQuery({ ...params })}`);
  },

  deleteInstance: (id: string): Promise<InterfaceAdminInstance> => {
    return httpService.delete<InterfaceAdminInstance>(`/api/admin/instances/${id}`);
  },

  findSessions: (
    params: InterfaceAdminFilteredPaginationParams,
  ): Promise<InterfaceAdminPaginatedResponse<InterfaceAdminSession>> => {
    return httpService.get(`/api/admin/sessions${buildQuery({ ...params })}`);
  },
};
