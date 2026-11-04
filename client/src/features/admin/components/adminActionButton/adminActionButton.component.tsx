import type { ButtonHTMLAttributes, ReactNode } from "react";
import * as S from "./adminActionButton.styled";

export type AdminActionButtonVariant = "default" | "danger" | "ghostDanger";

interface InterfaceAdminActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminActionButtonVariant;
  isLoading?: boolean;
  icon?: ReactNode;
}

export function AdminActionButtonComponent({
  variant = "default",
  isLoading = false,
  icon,
  children,
  disabled,
  type = "button",
  ...rest
}: InterfaceAdminActionButtonProps) {
  return (
    <S.Button type={type} $variant={variant} disabled={disabled || isLoading} aria-busy={isLoading} {...rest}>
      {isLoading ? <S.Spinner size={16} /> : icon}
      {children}
    </S.Button>
  );
}
