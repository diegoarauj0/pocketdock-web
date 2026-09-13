export type SpacingKey =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96;

export interface InterfaceTheme {
  background: {
    default: string;
    light: string;
    dark: string;
  };

  text: {
    default: string;
    muted: string;
  };

  borderColor: {
    default: string;
    muted: string;
  };

  highlight: string;

  primary: string;
  onPrimary: string;

  inverse: {
    background: string;
    text: string;
  };

  secondary: string;

  danger: string;
  warning: string;
  success: string;
  info: string;

  spacing: { [K in SpacingKey]: string };

  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    full: string;
  };

  border: {
    thin: string;
    medium: string;
    thick: string;
  };

  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
    "6xl": string;
    "7xl": string;
    "8xl": string;
    "9xl": string;
  };

  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };

  breakpoint: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };

  size: {
    "3xs": string;
    "2xs": string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
    "6xl": string;
    "7xl": string;
    full: string;
  };
}