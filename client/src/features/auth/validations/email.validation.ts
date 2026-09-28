import { z } from "zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import type { TFunction } from "i18next";

export function getEmailSchema(t: TFunction) {
  return z.object({
    email: z
      .email(t("VALIDATION_EMAIL_FORMAT"))
      .min(AUTH_CONSTANT.EMAIL_MIN_LENGTH, t("VALIDATION_EMAIL_REQUIRED"))
      .max(
        AUTH_CONSTANT.EMAIL_MAX_LENGTH,
        t("VALIDATION_EMAIL_MAX_LENGTH", {
          max: AUTH_CONSTANT.EMAIL_MAX_LENGTH,
        }),
      ),
  });
}

export type InterfaceEmailFormValues = z.infer<ReturnType<typeof getEmailSchema>>;
