import { z } from "zod";

export function getVerificationCodeSchema(length: number) {
  return z.object({
    code: z.string().min(length).max(length),
  });
}
