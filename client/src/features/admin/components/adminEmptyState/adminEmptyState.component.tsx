import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import * as S from "./adminEmptyState.styled";

interface InterfaceAdminEmptyStateProps {
  description?: string;
  icon?: ReactNode;
  title: string;
}

export function AdminEmptyStateComponent({ description, icon, title }: InterfaceAdminEmptyStateProps) {
  return (
    <S.EmptyState>
      <S.Icon>{icon ?? <Inbox size={22} />}</S.Icon>
      <S.Title>{title}</S.Title>
      {description !== undefined && <S.Description>{description}</S.Description>}
    </S.EmptyState>
  );
}
