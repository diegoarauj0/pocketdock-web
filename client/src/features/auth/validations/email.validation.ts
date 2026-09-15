import { z } from "zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";

export function getEmailSchema() {
  return z.object({
    email: z
      .email("Enter a valid email.")
      .min(AUTH_CONSTANT.EMAIL_MIN_LENGTH, "Email is required.")
      .max(AUTH_CONSTANT.EMAIL_MAX_LENGTH, `Email must be at most ${AUTH_CONSTANT.EMAIL_MAX_LENGTH} characters.`),
  });
}

export type InterfaceEmailFormValues = z.infer<ReturnType<typeof getEmailSchema>>;
