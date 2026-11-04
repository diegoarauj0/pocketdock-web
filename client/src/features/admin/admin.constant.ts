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
    DELETE_USER: "adminDeleteUser",
    DELETE_INSTANCE: "adminDeleteInstance",
    REVOKE_SESSION: "adminRevokeSession",
    REVOKE_ALL_SESSIONS: "adminRevokeAllSessions",
  },
} as const;
