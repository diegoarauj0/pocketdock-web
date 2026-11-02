import { createContext, useContext } from "react";

export type ThemeType = "light" | "dark";

export interface InterfaceThemeContext {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<InterfaceThemeContext | undefined>(undefined);

export function useTheme() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) throw new Error("useTheme must be used within a ThemeProvider");

  return themeContext;
}
