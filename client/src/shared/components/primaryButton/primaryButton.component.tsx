import type { PropsWithChildren } from "react";
import * as S from "./primaryButton.styled";

interface InterfacePrimaryButton extends PropsWithChildren {
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export function PrimaryButtonComponent({ type, disabled, onClick, children }: InterfacePrimaryButton) {
  return (
    <S.Button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </S.Button>
  );
}
