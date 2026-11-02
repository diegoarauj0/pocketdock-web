import type { ApiResponseError } from "@/shared/http/http.client";
import type { InterfacePublicUser } from "../services/users.service";
import { usersService } from "../services/users.service";
import { useMutation } from "@tanstack/react-query";

export function useDeleteUserMutation() {
  return useMutation<InterfacePublicUser, ApiResponseError>({
    mutationFn: () => usersService.deleteUser(),
  });
}
