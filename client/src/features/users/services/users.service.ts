import { httpService } from "@/shared/services/http.service";

export interface InterfacePublicUser {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export const usersService = {
  deleteUser: (): Promise<InterfacePublicUser> => {
    return httpService.delete<InterfacePublicUser>("/api/users");
  },
};
