import type { PropsWithChildren } from "react";
import type { AdminBadgeTone } from "./adminBadge.styled";
import * as S from "./adminBadge.styled";

export type { AdminBadgeTone } from "./adminBadge.styled";

interface InterfaceAdminBadgeProps extends PropsWithChildren {
  tone?: AdminBadgeTone;
}

export function AdminBadgeComponent({ tone = "neutral", children }: InterfaceAdminBadgeProps) {
  return <S.Badge $tone={tone}>{children}</S.Badge>;
}
