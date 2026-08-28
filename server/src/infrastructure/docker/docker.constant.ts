export const DOCKER_CONSTANT = {
  POCKETBASE_REPOSITORY: "pocketdock/pocketbase",
  POCKETBASE_CONTEXT: "./src/infrastructure/docker",
  POCKETBASE_DOCKERFILE: "pocketbase.Dockerfile",
  POCKETBASE_VERSION: "0.40.1",
  POCKETBASE_TYPE: "pocketbase",

  POCKETBASE_LABEL_MANAGED: "com.pocketdock.managed",
  POCKETBASE_LABEL_TYPE: "com.pocketdock.type",
  POCKETBASE_LABEL_VERSION: "com.pocketdock.version",
  POCKETBASE_LABEL_INSTANCE_ID: "com.pocketdock.instance-id",
} as const;
