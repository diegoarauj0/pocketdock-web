import { LoaderCircle } from "lucide-react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Button = styled.button<{ $variant: "default" | "danger" | "ghostDanger" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  min-height: ${({ theme }) => theme.spacing[9]};
  padding: 0 ${({ theme }) => theme.spacing[3.5]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  white-space: nowrap;
  color: ${({ theme, $variant }) => {
    if ($variant === "danger") return theme.onPrimary;
    if ($variant === "ghostDanger") return theme.danger;

    return theme.inverse.text;
  }};

  background-color: ${({ theme, $variant }) => {
    if ($variant === "danger") return theme.danger;
    if ($variant === "ghostDanger") return "transparent";

    return theme.inverse.background;
  }};
  border: ${({ theme }) => theme.border.thin} solid
    ${({ theme, $variant }) =>
      $variant === "ghostDanger"
        ? `color-mix(in srgb, ${theme.danger} 45%, transparent)`
        : "transparent"};
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme, $variant }) => {
      if ($variant === "danger") return `color-mix(in srgb, ${theme.danger} 85%, ${theme.text.default})`;
      if ($variant === "ghostDanger") return `color-mix(in srgb, ${theme.danger} 12%, transparent)`;

      return `color-mix(in srgb, ${theme.inverse.background} 85%, ${theme.inverse.text})`;
    }};
    border-color: ${({ theme, $variant }) =>
      $variant === "ghostDanger" ? theme.danger : "transparent"};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const Spinner = styled(LoaderCircle)`
  animation: ${spin} 0.8s linear infinite;
`;
