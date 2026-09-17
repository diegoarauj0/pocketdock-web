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
} as const;
