import { THEME_CONSTANT } from "../constants/theme.constant";
import type { ThemeType } from "../contexts/theme.context";

export const themeStorageService = {
  setTheme: (theme: ThemeType) => {
    localStorage.setItem(THEME_CONSTANT.THEME_STORAGE_KEY, theme);
  },

  clear: () => {
    localStorage.removeItem(THEME_CONSTANT.THEME_STORAGE_KEY);
  },

  getTheme: (): ThemeType | null => {
    return localStorage.getItem(THEME_CONSTANT.THEME_STORAGE_KEY) as ThemeType;
  },
};
