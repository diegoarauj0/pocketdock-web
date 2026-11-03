import { useAuth } from "@/features/auth/contexts/auth.context";
import { Database, LogOut, Settings, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import * as S from "./header.styled";

export function HeaderComponent() {
  const { state, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  const isAuthenticated = state === "authenticated";
  const isAdmin = user?.isAdmin === true;
  const isSettingsPage = location.pathname.startsWith(APP_PATH.SETTINGS.LAYOUT);
  const isAdminPage = location.pathname.startsWith(APP_PATH.ADMIN.LAYOUT);

  const handleSignOut = () => {
    signOut();
    navigate(APP_PATH.HOME);
  };

  return (
    <S.Header>
      <S.Brand>
        <S.BrandLink to={APP_PATH.HOME}>
          <S.BrandIcon>
            <Database />
          </S.BrandIcon>
          <S.BrandName>{t("BRAND_POCKETDOCK")}</S.BrandName>
        </S.BrandLink>
      </S.Brand>

      <S.UserSection>
        {isAdmin && !isAdminPage && (
          <S.AdminLink to={APP_PATH.ADMIN.USERS} aria-label={t("HEADER_ADMIN")}>
            <ShieldCheck size={16} />
            <span>{t("HEADER_ADMIN")}</span>
          </S.AdminLink>
        )}

        {!isSettingsPage && (
          <S.SettingsLink to={APP_PATH.SETTINGS.INTERFACE} aria-label={t("HEADER_SETTINGS")}>
            <Settings size={16} />
            <span>{t("HEADER_SETTINGS")}</span>
          </S.SettingsLink>
        )}

        {isAuthenticated ? (
          <S.LogoutButton type="button" aria-label={t("HEADER_SIGN_OUT")} onClick={handleSignOut}>
            <LogOut size={16} />
            {t("HEADER_SIGN_OUT")}
          </S.LogoutButton>
        ) : (
          <S.SignInLink to={APP_PATH.AUTH.SIGN_IN}>{t("HEADER_SIGN_IN")}</S.SignInLink>
        )}
      </S.UserSection>
    </S.Header>
  );
}
