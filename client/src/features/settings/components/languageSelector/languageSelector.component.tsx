import type { InterfaceSegmentedControlOption } from "@/features/settings/components/segmentedControl/segmentedControl.component";
import { SegmentedControlComponent } from "@/features/settings/components/segmentedControl/segmentedControl.component";
import type { SupportedLanguage } from "@/features/locale/locale.type";
import { useTranslation } from "react-i18next";

const LANGUAGE_OPTIONS: readonly InterfaceSegmentedControlOption<SupportedLanguage>[] = [
  { value: "en", label: "English" },
  { value: "pt-BR", label: "Português (BR)" },
];

function resolveCurrentLanguage(language: string | undefined): SupportedLanguage {
  return language?.startsWith("pt") ? "pt-BR" : "en";
}

export function LanguageSelectorComponent() {
  const { i18n, t } = useTranslation("settings");

  const currentLanguage = resolveCurrentLanguage(i18n.resolvedLanguage ?? i18n.language);

  return (
    <SegmentedControlComponent
      ariaLabel={t("LANGUAGE_TITLE")}
      value={currentLanguage}
      options={LANGUAGE_OPTIONS}
      onChange={(language) => i18n.changeLanguage(language)}
    />
  );
}
