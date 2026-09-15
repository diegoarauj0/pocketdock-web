import { z } from "zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";

export function getPasswordAndConfirmSchema() {
  return z
    .object({
      password: z
        .string()
        .min(
          AUTH_CONSTANT.PASSWORD_MIN_LENGTH,
          `Password must be at least ${AUTH_CONSTANT.PASSWORD_MIN_LENGTH} characters.`,
        )
        .max(
          AUTH_CONSTANT.PASSWORD_MAX_LENGTH,
          `Password must be at most ${AUTH_CONSTANT.PASSWORD_MAX_LENGTH} characters.`,
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
}

export type InterfacePasswordAndConfirmFormValues = z.infer<ReturnType<typeof getPasswordAndConfirmSchema>>;
