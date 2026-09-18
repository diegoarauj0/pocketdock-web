export const USER_CONSTANT = {
  USERNAME_MAX_LENGTH: 16,
  USERNAME_MIN_LENGTH: 1,

  THROTTLE: {
    DELETE_ACCOUNT: { limit: 5, ttl: 60_000 },
  },
} as const;
