import type { PropsWithChildren } from "react";
import * as S from "./primaryButton.styled";

interface InterfacePrimaryButton extends PropsWithChildren {
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

export function PrimaryButtonComponent({ type, disabled, onClick, children }: InterfacePrimaryButton) {
  return (
    <S.Button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </S.Button>
  );
}
