export const INSTANCE_CONSTANT = {
  CONTAINER_NAME_PREFIX: "pocketdock-instance",
  REPOSITORY: "pocketdock/pocketbase",
  DOCKERFILE: "pocketbase.Dockerfile",
  TYPE: "pocketbase",
  VERSION: "0.40.1",
  PORT: 8080,
  NETWORK: "pocketdock-instances",

  LABEL_INSTANCE_ID: "com.pocketdock.instance-id",
  LABEL_MANAGED: "com.pocketdock.managed",
  LABEL_VERSION: "com.pocketdock.version",
  LABEL_TYPE: "com.pocketdock.type",

  SUPERUSER_CREATE_ATTEMPTS: 5,
  SUPERUSER_CREATE_RETRY_DELAY_MS: 2000,

  OUTBOX: {
    CREATION: { TYPE: "INSTANCE_CREATION", MAX_ATTEMPTS: 3, EVENT: "INSTANCE_CREATION" },
    REMOVAL: { TYPE: "INSTANCE_REMOVAL", MAX_ATTEMPTS: 5, EVENT: "INSTANCE_REMOVAL" },
  },

  THROTTLE: {
    CREATE: { limit: 5, ttl: 60_000 },
    LIST: { limit: 60, ttl: 60_000 },
    VIEW: { limit: 60, ttl: 60_000 },
    MUTATION: { limit: 20, ttl: 60_000 },
  },

  LOCK: {
    RESOURCE_PREFIX: "instance",
    TIMEOUT_MS: 60_000,
  },
} as const;
