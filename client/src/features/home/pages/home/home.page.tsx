import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import * as S from "./home.styled";

export function HomePage() {
  const navigate = useNavigate();
  const { state } = useAuth();

  const isAuthenticated = state === "authenticated";

  const handleNavigate = () => {
    navigate(isAuthenticated ? APP_PATH.INSTANCES : APP_PATH.AUTH.SIGN_UP);
  };

  return (
    <S.PageWrapper>
      <HeaderComponent />

      <S.Content>
        <S.Title>Your PocketBase servers, under control.</S.Title>
        <S.Description>
          Keep your PocketBase instances organized, available, and under control from one simple workspace.
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
