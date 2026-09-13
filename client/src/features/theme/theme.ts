import type { InterfaceTheme, SpacingKey } from "./theme.type";

const px = (value: number): string => `${value}px`;

const SPACING_KEYS = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
] as const satisfies readonly SpacingKey[];

const spacing = Object.fromEntries(
  SPACING_KEYS.map((key) => [key, px(key * 4)]),
) as { [K in SpacingKey]: string };

const SIZE = {
  spacing,

  radius: {
    none: "0px",
    sm: "2px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    "3xl": "24px",
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
    "6xl": "60px",
    "7xl": "72px",
    "8xl": "96px",
    "9xl": "128px",
  },

  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  breakpoint: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  size: {
    "3xs": "256px",
    "2xs": "288px",
    xs: "320px",
    sm: "384px",
    md: "448px",
    lg: "512px",
    xl: "576px",
    "2xl": "672px",
    "3xl": "768px",
    "4xl": "896px",
    "5xl": "1024px",
    "6xl": "1152px",
    "7xl": "1280px",
    full: "100%",
  },
};

export const DARK_THEME: InterfaceTheme = {
  background: {
    default: "#0a0a0a",
    light: "#111111",
    dark: "#000000",
  },

  text: {
    default: "#fafafa",
    muted: "#888888",
  },

  borderColor: {
    default: "#333333",
    muted: "#262626",
  },

  highlight: "#444444",

  primary: "#34d399",
  onPrimary: "#ffffff",

  inverse: {
    background: "#fafafa",
    text: "#000000",
  },

  secondary: "#7928ca",
  danger: "#eb4d4b",
  warning: "#f5a623",
  success: "#229e5d",
  info: "#00bcf2",

  ...SIZE,
};

export const LIGHT_THEME: InterfaceTheme = {
  background: {
    default: "#ffffff",
    light: "#fafafa",
    dark: "#ffffff",
  },
  text: {
    default: "#111111",
    muted: "#666666",
  },
  borderColor: {
    default: "#d4d4d4",
    muted: "#eaeaea",
  },
  highlight: "#d4d4d4",

  primary: "#059669",
  onPrimary: "#ffffff",

  inverse: {
    background: "#111111",
    text: "#ffffff",
  },

  secondary: "#7928ca",
  danger: "#eb4d4b",
  warning: "#f5a623",
  success: "#229e5d",
  info: "#00bcf2",

  ...SIZE,
};
