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
  secondary: string;

  danger: string;
  warning: string;
  success: string;
  info: string;

  spacing: {
    0: string;
    0.5: string;
    1: string;
    1.5: string;
    2: string;
    2.5: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    14: string;
    16: string;
    20: string;
    24: string;
    30: string;
  };

  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
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
  };

  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };

  breakpoint: {
    sm: string;
    md: string;
    lg: string;
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
    full: string;
  };
}
