export const INSTANCE_CONSTANT = {
  CONTAINER_NAME_PREFIX: "pocketdock-instance",
  CONTEXT: "./src/infrastructure/docker",
  REPOSITORY: "pocketdock/pocketbase",
  DOCKERFILE: "pocketbase.Dockerfile",
  TYPE: "pocketbase",
  VERSION: "0.40.1",
  PORT: 8080,

  LABEL_INSTANCE_ID: "com.pocketdock.instance-id",
  LABEL_MANAGED: "com.pocketdock.managed",
  LABEL_VERSION: "com.pocketdock.version",
  LABEL_TYPE: "com.pocketdock.type",
} as const;
