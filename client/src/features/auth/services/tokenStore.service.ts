import { APP_CONSTANT } from "@/app/app.constant";

export const tokenStoreService = {
  get: (): string | null => localStorage.getItem(APP_CONSTANT.ACCESS_TOKEN_STORAGE_KEY),

  set: (token: string) => {
    localStorage.setItem(APP_CONSTANT.ACCESS_TOKEN_STORAGE_KEY, token);
  },

  clear: () => {
    localStorage.removeItem(APP_CONSTANT.ACCESS_TOKEN_STORAGE_KEY);
  },
};
