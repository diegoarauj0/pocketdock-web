import { SettingsRowComponent } from "@/features/settings/components/settingsRow/settingsRow.component";
import { useSettingsHandlers } from "@/features/settings/hooks/useSettingsHandlers.hook";
import { useTranslation } from "react-i18next";
import { LogOut, ShieldAlert, Trash2 } from "lucide-react";
import * as S from "./security.styled";

export function SecuritySettingsPage() {
  const {
    confirmDialog,
    handleDeleteUser,
    handleLogoutAll,
    handleSignOut,
    isBusy,
    isDeleteUserPending,
    isLogoutAllPending,
    isSigningOut,
  } = useSettingsHandlers();

  const { t } = useTranslation("settings");

  return (
    <>
      <S.SectionHeader>
        <S.SectionTitle>{t("SECURITY_TITLE")}</S.SectionTitle>
        <S.SectionDescription>{t("SECURITY_DESCRIPTION")}</S.SectionDescription>
      </S.SectionHeader>

      <S.Card>
        <SettingsRowComponent title={t("SECURITY_SESSION_TITLE")} description={t("SECURITY_SESSION_DESCRIPTION")}>
          <S.ActionButton type="button" disabled={isBusy} onClick={handleSignOut}>
            {isSigningOut ? <S.Spinner size={16} /> : <LogOut size={16} />}
            {t("SECURITY_SIGN_OUT")}
          </S.ActionButton>
        </SettingsRowComponent>

        <S.Divider />

        <SettingsRowComponent
          title={t("SECURITY_ALL_SESSIONS_TITLE")}
          description={t("SECURITY_ALL_SESSIONS_DESCRIPTION")}
        >
          <S.ActionButton type="button" disabled={isBusy} onClick={handleLogoutAll}>
            {isLogoutAllPending ? <S.Spinner size={16} /> : <LogOut size={16} />}
            {t("SECURITY_SIGN_OUT_ALL")}
          </S.ActionButton>
        </SettingsRowComponent>
      </S.Card>

      <S.DangerCard>
        <S.DangerHeader>
          <S.DangerTitle>
            <ShieldAlert size={16} />
            {t("SECURITY_DANGER_TITLE")}
          </S.DangerTitle>
          <S.DangerDescription>{t("SECURITY_DANGER_DESCRIPTION")}</S.DangerDescription>
        </S.DangerHeader>

        <S.DangerDivider />

        <SettingsRowComponent
          title={t("SECURITY_DELETE_USER_TITLE")}
          description={t("SECURITY_DELETE_USER_DESCRIPTION")}
        >
          <S.DangerButton type="button" disabled={isBusy} onClick={handleDeleteUser}>
            {isDeleteUserPending ? <S.Spinner size={16} /> : <Trash2 size={16} />}
            {t("SECURITY_DELETE_USER")}
          </S.DangerButton>
        </SettingsRowComponent>
      </S.DangerCard>

      {confirmDialog}
    </>
  );
}
