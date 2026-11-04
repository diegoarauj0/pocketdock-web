import { fadeInUp } from "@/features/theme/animations";
import { LoaderCircle } from "lucide-react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const BackRow = styled.div`
  ${fadeInUp(0)}
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};

  margin-left: -${({ theme }) => theme.spacing[2.5]};
  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[2.5]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
  text-decoration: none;

  border-radius: ${({ theme }) => theme.radius.md};

  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.text.default};
    background-color: ${({ theme }) => theme.background.light};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const UserCard = styled.section`
  ${fadeInUp(80)}

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};

  padding: ${({ theme }) => theme.spacing[6]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const UserMain = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const Avatar = styled.div`
  display: grid;
  place-items: center;

  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing[16]};
  height: ${({ theme }) => theme.spacing[16]};

  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 700;
  text-transform: uppercase;

  color: ${({ theme }) => theme.primary};
  background-color: color-mix(in srgb, ${({ theme }) => theme.primary} 12%, transparent);
  border: ${({ theme }) => theme.border.thin} solid
    color-mix(in srgb, ${({ theme }) => theme.primary} 32%, transparent);
  border-radius: ${({ theme }) => theme.radius.full};
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  flex: 1 1 ${({ theme }) => theme.size["2xs"]};
  min-width: 0;
`;

export const Username = styled.h2`
  overflow-wrap: anywhere;

  font-size: ${({ theme }) => theme.fontSize["2xl"]};
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text.default};
`;

export const Email = styled.p`
  overflow-wrap: anywhere;

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
`;

export const Badges = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const RoleActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const RoleButton = styled.button<{ $variant?: "promote" | "demote" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  min-height: ${({ theme }) => theme.spacing[9]};
  padding: 0 ${({ theme }) => theme.spacing[3.5]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  white-space: nowrap;
  color: ${({ theme, $variant }) => ($variant === "demote" ? theme.onPrimary : theme.inverse.text)};

  background-color: ${({ theme, $variant }) => ($variant === "demote" ? theme.danger : theme.inverse.background)};
  border: ${({ theme }) => theme.border.thin} solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme, $variant }) =>
      $variant === "demote"
        ? `color-mix(in srgb, ${theme.danger} 85%, ${theme.text.default})`
        : `color-mix(in srgb, ${theme.inverse.background} 85%, ${theme.inverse.text})`};
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

export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  padding-top: ${({ theme }) => theme.spacing[5]};
  border-top: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.md})`} {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  min-width: 0;
`;

export const MetaLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const MetaValue = styled.span`
  overflow-wrap: anywhere;

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.default};
`;

export const Section = styled.section`
  ${fadeInUp(160)}

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  min-width: 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
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

export const SectionCount = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
  white-space: nowrap;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;
