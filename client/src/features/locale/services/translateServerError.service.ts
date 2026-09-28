import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import type { TFunction } from "i18next";

const MISSING_KEY_TOKEN = "\u0000MISSING_KEY_TOKEN\u0000";

function getExceptionReason(details: unknown): string | undefined {
  if (typeof details !== "object" || details === null) return undefined;

  const reason = (details as { reason?: unknown }).reason;

  return typeof reason === "string" ? reason : undefined;
}

export function translateServerError(
  t: TFunction,
  error: unknown,
  fallbackMessage: string = t("NOTIFICATION_UNKNOWN_ERROR", { ns: "common" }),
): string {
  if (!(error instanceof ApiResponseError) || error.code === ERROR_CODES.VALIDATION_ERROR) {
    return fallbackMessage;
  }

  const reason = getExceptionReason(error.details);

  if (reason !== undefined) {
    const reasonMessage = t(`ERROR_${error.code}_${reason}`, { defaultValue: MISSING_KEY_TOKEN });

    if (reasonMessage !== MISSING_KEY_TOKEN) return reasonMessage;
  }

  const baseKey = `ERROR_${error.code}`;
  const baseMessage = t(baseKey);

  return baseMessage === baseKey ? fallbackMessage : baseMessage;
}
