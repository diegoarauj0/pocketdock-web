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

  ORPHAN_GRACE_PERIOD_MS: 5 * 60 * 1000,

  THROTTLE: {
    CREATE: { limit: 5, ttl: 60_000 },
    LIST: { limit: 60, ttl: 60_000 },
    VIEW: { limit: 60, ttl: 60_000 },
    MUTATION: { limit: 20, ttl: 60_000 },
  },
} as const;
