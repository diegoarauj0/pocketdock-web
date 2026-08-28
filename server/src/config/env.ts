import { MailStrategyID } from "src/modules/mail/strategies/base.strategy";
import { randomBytes } from "node:crypto";
import { config } from "dotenv";
import { z } from "zod";

config({
  path: [`.env.${process.env.NODE_ENV || "development"}`, ".env"],
});

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  SECRET: z.string().default(randomBytes(32).toString("hex")),
  RESEND_FROM: z.string().default("onboarding@resend.dev"),
  MAIL_STRATEGY_ID: z.enum(MailStrategyID).default(MailStrategyID.LOCAL),
  RESEND_API_KEY: z.string().optional(),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_USER: z.string().default("pocketdock"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string().default("pocketdock"),
  OAUTH_SUCCESS_REDIRECT_URL: z.string().default("http://localhost:5173"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),
  DOCKER_HOST: z.string().default("unix:///var/run/docker.sock"),
  LOG_CONTEXTS: z
    .string()
    .transform((val) => val.split(",").map((item) => item.trim()))
    .default(["log", "error"]),
});

const { data, error, success } = envSchema.safeParse(process.env);

if (!success) {
  console.error(error);
  throw new Error("invalid env.");
}

export const env = data;
