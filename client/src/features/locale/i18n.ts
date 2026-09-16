import { LOCALE_CONSTANT } from "./constants/locale.constant";
import { localeStorageService } from "./services/localeStorage.service";
import { initReactI18next } from "react-i18next";
import { type SupportedLanguage } from "./locale.type";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import i18n from "i18next";

i18n.on("languageChanged", (language) => {
  localeStorageService.set(language as SupportedLanguage);

  document.documentElement.lang = language;
});

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: LOCALE_CONSTANT.SUPPORTED_LANGUAGES,
    fallbackLng: LOCALE_CONSTANT.FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    defaultNS: "common",
    fallbackNS: ["common"],
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: LOCALE_CONSTANT.STORAGE_KEY,
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
