import { EmailVerificationType } from "src/modules/emailVerification/emailVerification.entity";
import { EMAIL_VERIFICATION_CONSTANT } from "src/modules/emailVerification/emailVerification.constant";
import { Locale, MAIL_CONSTANT } from "../mail.constant";
import { Injectable, Logger } from "@nestjs/common";
import { promises as fs } from "node:fs";
import path from "node:path";

export interface InterfaceEmailContent {
  subject: string;
  greetingPrefix: string;
  expiresInMessage: string;
  preheaderText: string;
  title: string;
  description: string;
}

type DictionaryType = Record<
  EmailVerificationType,
  Omit<InterfaceEmailContent, "subject" | "greetingPrefix" | "expiresInMessage">
> & {
  subject: string;
  greetingPrefix: string;
  expiresInMessage: string;
};

@Injectable()
export class MailTranslationService {
  private readonly logger = new Logger(MailTranslationService.name);

  private readonly i18nPath = path.join(__dirname, "..", "i18n");

  private readonly cache = new Map<Locale, DictionaryType>();

  public async translate(locale: Locale, emailVerificationType: EmailVerificationType): Promise<InterfaceEmailContent> {
    const dictionary = await this.load(locale);

    return {
      subject: dictionary.subject,
      greetingPrefix: dictionary.greetingPrefix,
      expiresInMessage: this.interpolate(dictionary.expiresInMessage, {
        minutes: EMAIL_VERIFICATION_CONSTANT.EXPIRES_IN_MS / 1000 / 60,
      }),
      ...dictionary[emailVerificationType],
    };
  }

  private async load(locale: Locale): Promise<DictionaryType> {
    const cachedDictionary = this.cache.get(locale);

    if (cachedDictionary) return cachedDictionary;

    try {
      const filePath = path.join(this.i18nPath, locale, "email.json");

      const source = await fs.readFile(filePath, "utf8");

      const dictionary = JSON.parse(source) as DictionaryType;

      this.cache.set(locale, dictionary);

      return dictionary;
    } catch (error) {
      if (locale === MAIL_CONSTANT.DEFAULT_LOCALE) throw error;

      this.logger.warn(
        `Failed to load email translation for locale "${locale}", falling back to "${MAIL_CONSTANT.DEFAULT_LOCALE}"`,
        error,
      );

      return this.load(MAIL_CONSTANT.DEFAULT_LOCALE);
    }
  }

  private interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => String(params[key] ?? match));
  }
}
