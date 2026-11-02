import styled, { keyframes } from "styled-components";
import { LoaderCircle } from "lucide-react";
import { fadeInUp } from "@/features/theme/animations";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const SectionHeader = styled.div`
  ${fadeInUp(80)}

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1.5]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.text.default};
`;

export const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.muted};
`;

export const Card = styled.section`
  ${fadeInUp(160)}

  overflow: hidden;

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Divider = styled.div`
  height: ${({ theme }) => theme.border.thin};
  background-color: ${({ theme }) => theme.borderColor.muted};
`;

export const DangerCard = styled.section`
  ${fadeInUp(240)}

  overflow: hidden;

  background-color: color-mix(in srgb, ${({ theme }) => theme.danger} 4%, ${({ theme }) => theme.background.default});
  border: ${({ theme }) => theme.border.thin} solid
    color-mix(in srgb, ${({ theme }) => theme.danger} 35%, ${({ theme }) => theme.borderColor.muted});
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const DangerHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  padding: ${({ theme }) => theme.spacing[5]} ${({ theme }) => theme.spacing[6]};
`;

export const DangerTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.danger};
`;

export const DangerDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.muted};
`;

export const DangerDivider = styled.div`
  height: ${({ theme }) => theme.border.thin};
  background-color: color-mix(in srgb, ${({ theme }) => theme.danger} 35%, ${({ theme }) => theme.borderColor.muted});
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  min-height: ${({ theme }) => theme.spacing[9]};
  padding: 0 ${({ theme }) => theme.spacing[3.5]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  white-space: nowrap;
  color: ${({ theme }) => theme.text.default};

  background-color: transparent;
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.default};
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.background.light};
    border-color: ${({ theme }) => theme.highlight};
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

export const DangerButton = styled(ActionButton)`
  color: ${({ theme }) => theme.onPrimary};

  background-color: ${({ theme }) => theme.danger};
  border-color: ${({ theme }) => theme.danger};

  &:hover:not(:disabled) {
    background-color: color-mix(in srgb, ${({ theme }) => theme.danger} 85%, ${({ theme }) => theme.text.default});
    border-color: color-mix(in srgb, ${({ theme }) => theme.danger} 85%, ${({ theme }) => theme.text.default});
  }
`;

export const Spinner = styled(LoaderCircle)`
  animation: ${spin} 0.8s linear infinite;
`;
