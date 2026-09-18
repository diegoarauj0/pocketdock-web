export const AUTH_CONSTANT = {
  DUMMY_PASSWORD_HASH: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  OAUTH_STATE_EXPIRES_IN_MS: 5 * 60 * 1000,
  OAUTH_SUCCESS_REDIRECT_QUERY_KEY: "code",
  OAUTH_SUCCESS_REDIRECT_QUERY_VALUE: "oauth_success",

  THROTTLE: {
    SIGN_IN: { limit: 10, ttl: 60_000 },
    SIGN_UP: { limit: 10, ttl: 60_000 },
    REFRESH: { limit: 30, ttl: 60_000 },
    FORGOT_PASSWORD: { limit: 5, ttl: 60_000 },
    EMAIL_VERIFICATION: { limit: 5, ttl: 60_000 },
    SESSION: { limit: 60, ttl: 60_000 },
    OAUTH: { limit: 10, ttl: 60_000 },
  },
} as const;
