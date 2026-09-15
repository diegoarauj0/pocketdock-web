import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { OAUTH_CONSTANT } from "@/features/auth/constants/oauth.constant";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import * as S from "./home.styled";

export function HomePage() {
  const { state } = useAuth();
  const navigate = useNavigate();

  const [fromOAuth] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);

    return (
      searchParams.get(OAUTH_CONSTANT.SUCCESS_REDIRECT_QUERY_KEY) ===
      OAUTH_CONSTANT.SUCCESS_REDIRECT_QUERY_VALUE
    );
  });

  useEffect(() => {
    if (!fromOAuth) return;

    const url = new URL(window.location.href);

    url.searchParams.delete(OAUTH_CONSTANT.SUCCESS_REDIRECT_QUERY_KEY);
    window.history.replaceState({}, "", url.toString());
  }, [fromOAuth]);

  const isAuthenticated = state === "authenticated";

  useEffect(() => {
    if (fromOAuth && isAuthenticated) {
      navigate(APP_PATH.INSTANCES, { replace: true });
    }
  }, [fromOAuth, isAuthenticated, navigate]);

  if (state === "loading") return <LoadingScreenComponent />;

  const handleNavigate = () => {
    navigate(isAuthenticated ? APP_PATH.INSTANCES : APP_PATH.AUTH.SIGN_UP);
  };

  return (
    <S.PageWrapper>
      <HeaderComponent />

      <S.Content>
        <S.Title>Your PocketBase servers, under control.</S.Title>
        <S.Description>
          Keep your PocketBase instances organized, available, and under control from one simple
          workspace.
        </S.Description>

        <S.Actions>
          <PrimaryButtonComponent type="button" onClick={handleNavigate}>
            {isAuthenticated ? "View my instances" : "Create account"}
          </PrimaryButtonComponent>
        </S.Actions>
      </S.Content>
    </S.PageWrapper>
  );
}