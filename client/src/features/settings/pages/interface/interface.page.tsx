import { LanguageSelectorComponent } from "@/features/settings/components/languageSelector/languageSelector.component";
import { SettingsRowComponent } from "@/features/settings/components/settingsRow/settingsRow.component";
import { ThemeSelectorComponent } from "@/features/settings/components/themeSelector/themeSelector.component";
import { useTranslation } from "react-i18next";
import * as S from "./interface.styled";

export function InterfaceSettingsPage() {
  const { t } = useTranslation("settings");

  return (
    <>
      <S.SectionHeader>
        <S.SectionTitle>{t("INTERFACE_TITLE")}</S.SectionTitle>
        <S.SectionDescription>{t("INTERFACE_DESCRIPTION")}</S.SectionDescription>
      </S.SectionHeader>

      <S.Card>
        <SettingsRowComponent title={t("LANGUAGE_TITLE")} description={t("LANGUAGE_DESCRIPTION")}>
          <LanguageSelectorComponent />
        </SettingsRowComponent>

        <S.Divider />

        <SettingsRowComponent title={t("THEME_TITLE")} description={t("THEME_DESCRIPTION")}>
          <ThemeSelectorComponent />
        </SettingsRowComponent>
      </S.Card>

      <S.Note>{t("AUTO_SAVE_NOTE")}</S.Note>
    </>
  );
}
