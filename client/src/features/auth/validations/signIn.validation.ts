import { AUTH_CONSTANT } from "../constants/auth.constant";
import type { TFunction } from "i18next";
import z from "zod";

export function getSignInSchema(t: TFunction) {
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
    password: z.string().min(1, t("VALIDATION_PASSWORD_REQUIRED")),
  });
}

export type InterfaceSignInFormValues = z.infer<ReturnType<typeof getSignInSchema>>;
