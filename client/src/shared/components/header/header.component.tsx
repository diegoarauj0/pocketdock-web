import { Database, LogOut } from "lucide-react";
import * as S from "./header.styled";

export function HeaderComponent() {
  return (
    <S.Header>
      <S.Brand>
        <S.BrandIcon>
          <Database />
        </S.BrandIcon>
        <S.BrandName>PocketDock</S.BrandName>
      </S.Brand>

      <S.UserSection>
        <S.LogoutButton type="button" aria-label="Sair">
          <LogOut size={16} />
          Sair
        </S.LogoutButton>
      </S.UserSection>
    </S.Header>
  );
}
