import { z } from "zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import type { TFunction } from "i18next";

export function getPasswordAndConfirmSchema(t: TFunction) {
  return z
    .object({
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

export type InterfacePasswordAndConfirmFormValues = z.infer<ReturnType<typeof getPasswordAndConfirmSchema>>;
