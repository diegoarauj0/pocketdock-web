import type { ThemeType } from "@/features/theme/contexts/theme.context";
import { APP_CONSTANT } from "@/app/app.constant";

export const themeStorageService = {
  setTheme: (theme: ThemeType) => {
    localStorage.setItem(APP_CONSTANT.THEME_STORAGE_KEY, theme);
  },

  clear: () => {
    localStorage.removeItem(APP_CONSTANT.THEME_STORAGE_KEY);
  },

  getTheme: (): ThemeType | null => {
    return localStorage.getItem(APP_CONSTANT.THEME_STORAGE_KEY) as ThemeType;
  },
};
