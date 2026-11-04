export const ADMIN_CONSTANT = {
  ROUTER: {
    LAYOUT: "admin",
    USERS: "users",
    INSTANCES: "instances",
  },

  PAGE_SIZE: 20,
  DETAIL_PAGE_SIZE: 10,

  NOTIFICATION_IDS: {
    PROMOTE_USER: "adminPromoteUser",
    DEMOTE_USER: "adminDemoteUser",
  },
} as const;
