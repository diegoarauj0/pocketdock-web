import { Database, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import { useAuth } from "@/features/auth/contexts/auth.context";
import * as S from "./header.styled";

export function HeaderComponent() {
  const { state, signOut } = useAuth();
  const navigate = useNavigate();

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
          <S.BrandName>PocketDock</S.BrandName>
        </S.BrandLink>
      </S.Brand>

      <S.UserSection>
        {isAuthenticated ? (
          <S.LogoutButton type="button" aria-label="Sign out" onClick={handleSignOut}>
            <LogOut size={16} />
            Sign out
          </S.LogoutButton>
        ) : (
          <S.SignInLink to={APP_PATH.AUTH.SIGN_IN}>Sign in</S.SignInLink>
        )}
      </S.UserSection>
    </S.Header>
  );
}
