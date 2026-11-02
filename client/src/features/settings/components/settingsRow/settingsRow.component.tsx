import type { PropsWithChildren } from "react";
import * as S from "./settingsRow.styled";

interface InterfaceSettingsRowProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function SettingsRowComponent({ title, description, children }: InterfaceSettingsRowProps) {
  return (
    <S.Row>
      <S.TextGroup>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
      </S.TextGroup>

      <S.Control>{children}</S.Control>
    </S.Row>
  );
}
