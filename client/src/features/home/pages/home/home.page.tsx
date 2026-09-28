import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import * as S from "./home.styled";

export function HomePage() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { t } = useTranslation("home");

  const isAuthenticated = state === "authenticated";

  const handleNavigate = () => {
    navigate(isAuthenticated ? APP_PATH.INSTANCES : APP_PATH.AUTH.SIGN_UP);
  };

  return (
    <S.PageWrapper>
      <HeaderComponent />

      <S.Content>
        <S.Title>{t("TITLE")}</S.Title>
        <S.Description>{t("DESCRIPTION")}</S.Description>

        <S.Actions>
          <PrimaryButtonComponent type="button" onClick={handleNavigate}>
            {isAuthenticated ? t("VIEW_MY_INSTANCES") : t("CREATE_ACCOUNT")}
          </PrimaryButtonComponent>
        </S.Actions>
      </S.Content>
    </S.PageWrapper>
  );
}
