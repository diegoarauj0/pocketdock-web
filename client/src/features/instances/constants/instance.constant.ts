export const INSTANCE_CONSTANT = {
  ROUTER: {
    INSTANCES: "instances",
    INSTANCE: "instance",
  },

  NOTIFICATION_IDS: {
    DELETE_INSTANCE: "deleteInstance",
    STOP_INSTANCE: "stopInstance",
    START_INSTANCE: "startInstance",
    CREATE_INSTANCE: "createInstance",
  },

  STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
  },
} as const;
