import { LOCALE_CONSTANT } from "../constants/locale.constant";
import type { SupportedLanguage } from "../locale.type";

export const localeStorageService = {
  get: (): SupportedLanguage | null => {
    return localStorage.getItem(LOCALE_CONSTANT.STORAGE_KEY) as SupportedLanguage | null;
  },

  set: (language: SupportedLanguage) => {
    localStorage.setItem(LOCALE_CONSTANT.STORAGE_KEY, language);
  },

  clear: () => {
    localStorage.removeItem(LOCALE_CONSTANT.STORAGE_KEY);
  },
};
