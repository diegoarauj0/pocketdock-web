import { Locale, MAIL_CONSTANT } from "../mail.constant";

export function resolveLocale(acceptLanguage: string | undefined): Locale {
  if (acceptLanguage === undefined) return MAIL_CONSTANT.DEFAULT_LOCALE;

  const [primaryTag] = acceptLanguage.split(",");

  const normalized = primaryTag.trim().toLowerCase();

  if (normalized.startsWith("pt")) return "pt-BR";

  if (normalized.startsWith("en")) return "en";

  return MAIL_CONSTANT.DEFAULT_LOCALE;
}
