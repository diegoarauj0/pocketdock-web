export const ADMIN_CONSTANT = {
  THROTTLE: {
    LIST_INSTANCES: { limit: 60, ttl: 60_000 },
    LIST_SESSIONS: { limit: 60, ttl: 60_000 },
    LIST_USERS: { limit: 60, ttl: 60_000 },
    ROLE: { limit: 10, ttl: 60_000 },
  },
} as const;
