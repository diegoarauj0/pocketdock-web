import type { InterfaceTheme } from "@/features/theme/theme.type";
import styled from "styled-components";

export type AdminBadgeTone = "primary" | "success" | "warning" | "danger" | "neutral";

const TONE_COLOR_MAP = {
  primary: (theme: InterfaceTheme) => theme.primary,
  success: (theme: InterfaceTheme) => theme.success,
  warning: (theme: InterfaceTheme) => theme.warning,
  danger: (theme: InterfaceTheme) => theme.danger,
  neutral: (theme: InterfaceTheme) => theme.text.muted,
} as const satisfies Record<AdminBadgeTone, (theme: InterfaceTheme) => string>;

function resolveToneColor(theme: InterfaceTheme, tone: AdminBadgeTone): string {
  return TONE_COLOR_MAP[tone](theme);
}

export const Badge = styled.span<{ $tone: AdminBadgeTone }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};

  width: fit-content;
  padding: ${({ theme }) => theme.spacing[0.5]} ${({ theme }) => theme.spacing[2]};

  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeight.tight};
  white-space: nowrap;

  color: ${({ theme, $tone }) => resolveToneColor(theme, $tone)};
  background-color: color-mix(in srgb, ${({ theme, $tone }) => resolveToneColor(theme, $tone)} 14%, transparent);
  border: ${({ theme }) => theme.border.thin} solid
    ${({ theme, $tone }) => `color-mix(in srgb, ${resolveToneColor(theme, $tone)} 38%, transparent)`};
  border-radius: ${({ theme }) => theme.radius.full};
`;
