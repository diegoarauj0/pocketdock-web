import styled from "styled-components";
import { fadeIn } from "@/features/theme/animations";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: ${({ theme }) => theme.spacing[4]};

  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

export const Dialog = styled.div`
  ${fadeIn(0)}

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};

  width: ${({ theme }) => theme.size.full};
  max-width: ${({ theme }) => theme.size["md"]};
  padding: ${({ theme }) => theme.spacing[6]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.default};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    padding: ${({ theme }) => theme.spacing[5]};
  }
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.text.default};
`;

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.muted};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};

  margin-top: ${({ theme }) => theme.spacing[4]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    flex-direction: column-reverse;

    button {
      width: ${({ theme }) => theme.size.full};
    }
  }
`;

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: ${({ theme }) => theme.spacing[9]};
  padding: 0 ${({ theme }) => theme.spacing[4]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;

  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled(BaseButton)`
  color: ${({ theme }) => theme.text.default};

  background-color: transparent;
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.default};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.background.light};
    border-color: ${({ theme }) => theme.highlight};
  }
`;

export const ConfirmButton = styled(BaseButton)<{ $danger: boolean }>`
  color: ${({ theme, $danger }) => ($danger ? theme.onPrimary : theme.inverse.text)};

  background-color: ${({ theme, $danger }) => ($danger ? theme.danger : theme.inverse.background)};
  border: ${({ theme, $danger }) =>
    `${theme.border.thin} solid ${$danger ? theme.danger : theme.inverse.background}`};

  &:hover:not(:disabled) {
    background-color: ${({ theme, $danger }) =>
      $danger
        ? `color-mix(in srgb, ${theme.danger} 85%, ${theme.text.default})`
        : `color-mix(in srgb, ${theme.inverse.background} 85%, ${theme.inverse.text})`};
  }
`;
