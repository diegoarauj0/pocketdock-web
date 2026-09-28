import { z } from "zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import type { TFunction } from "i18next";

export function getSignUpSchema(t: TFunction) {
  return z
    .object({
      username: z
        .string()
        .min(AUTH_CONSTANT.USERNAME_MIN_LENGTH, t("VALIDATION_NAME_REQUIRED"))
        .max(
          AUTH_CONSTANT.USERNAME_MAX_LENGTH,
          t("VALIDATION_NAME_MAX_LENGTH", {
            max: AUTH_CONSTANT.USERNAME_MAX_LENGTH,
          }),
        ),
      email: z
        .email(t("VALIDATION_EMAIL_FORMAT"))
        .min(AUTH_CONSTANT.EMAIL_MIN_LENGTH, t("VALIDATION_EMAIL_REQUIRED"))
        .max(
          AUTH_CONSTANT.EMAIL_MAX_LENGTH,
          t("VALIDATION_EMAIL_MAX_LENGTH", {
            max: AUTH_CONSTANT.EMAIL_MAX_LENGTH,
          }),
        ),
      password: z
        .string()
        .min(
          AUTH_CONSTANT.PASSWORD_MIN_LENGTH,
          t("VALIDATION_PASSWORD_MIN_LENGTH", {
            min: AUTH_CONSTANT.PASSWORD_MIN_LENGTH,
          }),
        )
        .max(
          AUTH_CONSTANT.PASSWORD_MAX_LENGTH,
          t("VALIDATION_PASSWORD_MAX_LENGTH", {
            max: AUTH_CONSTANT.PASSWORD_MAX_LENGTH,
          }),
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("VALIDATION_PASSWORDS_MATCH"),
    });
}

export type InterfaceSignUpFormValues = z.infer<ReturnType<typeof getSignUpSchema>>;
