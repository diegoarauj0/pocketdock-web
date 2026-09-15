import { AUTH_CONSTANT } from "../constants/auth.constant";
import { z } from "zod";

export function getSignInSchema() {
  return z.object({
    email: z
      .email("Enter a valid email.")
      .min(AUTH_CONSTANT.EMAIL_MIN_LENGTH, "Email is required.")
      .max(AUTH_CONSTANT.EMAIL_MAX_LENGTH, `Email must be at most ${AUTH_CONSTANT.EMAIL_MAX_LENGTH} characters.`),
    password: z.string().min(1, "Password is required."),
  });
}

export type InterfaceSignInFormValues = z.infer<ReturnType<typeof getSignInSchema>>;
