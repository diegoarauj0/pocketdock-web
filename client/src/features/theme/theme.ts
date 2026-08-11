import type { InterfaceTheme } from "./theme.type";

const SIZE = {
  spacing: {
    0: "0px",
    0.5: "2px",
    1: "4px",
    1.5: "6px",
    2: "8px",
    2.5: "10px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    14: "56px",
    16: "64px",
    20: "80px",
    24: "96px",
    30: "120px",
  },

  radius: {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  border: {
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },

  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },

  breakpoint: {
    sm: "700px",
    md: "768px",
    lg: "1200px",
  },

  size: {
    "3xs": "260px",
    "2xs": "280px",
    xs: "320px",
    sm: "384px",
    md: "448px",
    lg: "512px",
    xl: "576px",
    "2xl": "672px",
    "3xl": "768px",
    "4xl": "896px",
    "5xl": "1024px",
    full: "100%",
  },
};

export const DARK_THEME: InterfaceTheme = {
  background: {
    default: "oklch(0.15 0.015 139)",
    light: "oklch(0.2 0.015 139)",
    dark: "oklch(0.1 0.015 139)",
  },
  text: {
    default: "oklch(0.96 0.03 139)",
    muted: "oklch(0.76 0.03 139)",
  },
  borderColor: {
    default: "oklch(0.4 0.03 139)",
    muted: "oklch(0.3 0.03 139)",
  },
  highlight: "oklch(0.5 0.03 139)",
  primary: "oklch(78% 0.151 172)",
  secondary: "oklch(0.76 0.1 319)",
  danger: "oklch(0.7 0.05 30)",
  warning: "oklch(0.7 0.05 100)",
  success: "oklch(0.7 0.05 160)",
  info: "oklch(0.7 0.05 260)",

  ...SIZE,
};

export const LIGHT_THEME: InterfaceTheme = {
  background: {
    default: "oklch(0.96 0.015 139)",
    light: "oklch(1 0.015 139)",
    dark: "oklch(0.92 0.015 139)",
  },
  text: {
    default: "oklch(0.15 0.03 139)",
    muted: "oklch(0.4 0.03 139)",
  },
  borderColor: {
    default: "oklch(0.6 0.03 139)",
    muted: "oklch(0.7 0.03 139)",
  },
  highlight: "oklch(1 0.03 139)",
  primary: "oklch(78% 0.151 172)",
  secondary: "oklch(0.4 0.1 319)",
  danger: "oklch(0.5 0.05 30)",
  warning: "oklch(0.5 0.05 100)",
  success: "oklch(0.5 0.05 160)",
  info: "oklch(0.5 0.05 260)",

  ...SIZE,
};
