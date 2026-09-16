export const AUTH_CONSTANT = {
  ACCESS_TOKEN_STORAGE_KEY: "ACCESS_TOKEN",

  EMAIL_VERIFICATION_CODE_LENGTH: 6,

  ROUTER: {
    LAYOUT: "auth",
    SIGN_IN: "signIn",
    SIGN_UP: "signUp",
    EMAIL_VERIFICATION: "emailVerification",
    RESET_PASSWORD: "resetPassword",
    OAUTH_CALLBACK: "oauthCallback",
  },

  NOTIFICATION_IDS: {
    SIGN_IN: "signIn",
    SIGN_UP: "signUp",
    EMAIL_VERIFICATION: "emailVerification",
    RESET_PASSWORD: "resetPassword",
    OAUTH_SIGN_IN: "oauthSignIn",
  },

  EMAIL_MAX_LENGTH: 255,
  EMAIL_MIN_LENGTH: 1,

  USERNAME_MAX_LENGTH: 16,
  USERNAME_MIN_LENGTH: 1,

  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_MIN_LENGTH: 8,
} as const;
