import type { InterfaceSegmentedControlOption } from "@/features/settings/components/segmentedControl/segmentedControl.component";
import { SegmentedControlComponent } from "@/features/settings/components/segmentedControl/segmentedControl.component";
import { useTheme, type ThemeType } from "@/features/theme/contexts/theme.context";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ThemeSelectorComponent() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("settings");

  const options: readonly InterfaceSegmentedControlOption<ThemeType>[] = [
    { value: "light", label: t("THEME_LIGHT"), icon: <Sun size={14} /> },
    { value: "dark", label: t("THEME_DARK"), icon: <Moon size={14} /> },
  ];

  return (
    <SegmentedControlComponent
      ariaLabel={t("THEME_TITLE")}
      value={theme}
      options={options}
      onChange={setTheme}
    />
  );
}
