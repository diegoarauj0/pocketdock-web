import { z } from "zod";
import { APP_CONSTANT } from "@/app/app.constant";

export function getSignUpSchema() {
  return z
    .object({
      username: z
        .string()
        .min(APP_CONSTANT.USERNAME_MIN_LENGTH, "Name is required.")
        .max(APP_CONSTANT.USERNAME_MAX_LENGTH, `Name must be at most ${APP_CONSTANT.USERNAME_MAX_LENGTH} characters.`),
      email: z
        .email("Enter a valid email.")
        .min(APP_CONSTANT.EMAIL_MIN_LENGTH, "Email is required.")
        .max(APP_CONSTANT.EMAIL_MAX_LENGTH, `Email must be at most ${APP_CONSTANT.EMAIL_MAX_LENGTH} characters.`),
      password: z
        .string()
        .min(APP_CONSTANT.PASSWORD_MIN_LENGTH, `Password must be at least ${APP_CONSTANT.PASSWORD_MIN_LENGTH} characters.`)
        .max(APP_CONSTANT.PASSWORD_MAX_LENGTH, `Password must be at most ${APP_CONSTANT.PASSWORD_MAX_LENGTH} characters.`),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
}

export type InterfaceSignUpFormValues = z.infer<ReturnType<typeof getSignUpSchema>>;
