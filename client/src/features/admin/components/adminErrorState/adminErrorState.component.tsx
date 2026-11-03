import { AlertTriangle } from "lucide-react";
import * as S from "./adminErrorState.styled";

interface InterfaceAdminErrorStateProps {
  message: string;
  retryLabel: string;
  title: string;
  onRetry?: () => void;
}

export function AdminErrorStateComponent({ message, retryLabel, title, onRetry }: InterfaceAdminErrorStateProps) {
  return (
    <S.ErrorState role="alert">
      <S.Header>
        <AlertTriangle size={18} />
        <S.Title>{title}</S.Title>
      </S.Header>

      <S.Message>{message}</S.Message>

      {onRetry !== undefined && (
        <S.RetryButton type="button" onClick={onRetry}>
          {retryLabel}
        </S.RetryButton>
      )}
    </S.ErrorState>
  );
}
