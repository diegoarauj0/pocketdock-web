import type { PropsWithChildren } from "react";
import * as S from "./primaryButton.styled";

interface InterfacePrimaryButton extends PropsWithChildren {
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
}

export function PrimaryButtonComponent({ type, disabled, children }: InterfacePrimaryButton) {
  return (
    <S.Button type={type} disabled={disabled}>
      {children}
    </S.Button>
  );
}
