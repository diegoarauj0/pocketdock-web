import { useAuth } from "@/features/auth/contexts/auth.context";
import { Database, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import * as S from "./header.styled";

export function HeaderComponent() {
  const { state, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const isAuthenticated = state === "authenticated";

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
