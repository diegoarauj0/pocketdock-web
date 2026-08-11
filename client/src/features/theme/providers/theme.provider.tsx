import { ThemeContext, type ThemeType } from "@/features/theme/contexts/theme.context";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { themeStorageService } from "@/features/theme/services/themeStorage.service";
import { DARK_THEME, LIGHT_THEME } from "@/features/theme/theme";
import { useCallback, useState } from "react";

interface InterfaceThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider(props: InterfaceThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = themeStorageService.getTheme();

    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    return systemPrefersDark ? "dark" : "light";
  });

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "light" ? "dark" : "light";

      themeStorageService.setTheme(nextTheme);

      return nextTheme;
    });
  }, []);

  const value = theme === "dark" ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme }}>
      <StyledThemeProvider theme={value}>{props.children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
