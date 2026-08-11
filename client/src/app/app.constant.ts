export const APP_CONSTANT = {
  NAME: "PocketDock",
  VERSION: "1.0.0",

  ROUTER: {
    AUTH: {
      SIGN_IN: "signIn",
      SIGN_UP: "signUp",
      EMAIL_VERIFICATION: "emailVerification",
      RESET_PASSWORD: "resetPassword",
      LAYOUT: "auth",
    },
  },

  NOTIFICATION_AUTO_CLOSE: 5000,

  NOTIFICATION_IDS: {
    SIGN_IN: "signIn",
    SIGN_UP: "signUp",
    EMAIL_VERIFICATION: "emailVerification",
    RESET_PASSWORD: "resetPassword",
  },

  EMAIL_VERIFICATION_CODE_LENGTH: 6,

  THEME_STORAGE_KEY: "THEME",

  EMAIL_MAX_LENGTH: 255,
  EMAIL_MIN_LENGTH: 1,

  USERNAME_MAX_LENGTH: 16,
  USERNAME_MIN_LENGTH: 1,

  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_MIN_LENGTH: 8,
};
