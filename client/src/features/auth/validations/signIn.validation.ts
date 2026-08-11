import { z } from "zod";
import { APP_CONSTANT } from "@/app/app.constant";

export function getSignInSchema() {
  return z.object({
    email: z
      .email("Enter a valid email.")
      .min(APP_CONSTANT.EMAIL_MIN_LENGTH, "Email is required.")
      .max(APP_CONSTANT.EMAIL_MAX_LENGTH, `Email must be at most ${APP_CONSTANT.EMAIL_MAX_LENGTH} characters.`),
    password: z.string().min(1, "Password is required."),
  });
}

export type InterfaceSignInFormValues = z.infer<ReturnType<typeof getSignInSchema>>;
