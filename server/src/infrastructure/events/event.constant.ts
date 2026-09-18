export enum EventStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export const EVENT_CONSTANT = {
  MAX_ATTEMPTS: 5,
  POLLING_INTERVAL_MS: 2_000,
  POLLING_BATCH_SIZE: 10,
} as const;

export type InterfaceEventPayloadBase = object;
