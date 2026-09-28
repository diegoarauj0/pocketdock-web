import { AUTH_CONSTANT } from "../constants/auth.constant";

export const tokenStoreService = {
  get: (): string | null => localStorage.getItem(AUTH_CONSTANT.ACCESS_TOKEN_STORAGE_KEY),

  set: (token: string) => {
    localStorage.setItem(AUTH_CONSTANT.ACCESS_TOKEN_STORAGE_KEY, token);
  },

  clear: () => {
    localStorage.removeItem(AUTH_CONSTANT.ACCESS_TOKEN_STORAGE_KEY);
  },
};
