import { fadeInUp } from "@/features/theme/animations";
import styled from "styled-components";
import { Link } from "react-router";

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

export const List = styled.div`
  ${fadeInUp(160)}

  display: flex;
  flex-direction: column;

  overflow: hidden;

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const UserRow = styled(Link)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};

  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[5]};

  color: inherit;
  text-decoration: none;

  border-bottom: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};

  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.background.light};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: -${({ theme }) => theme.border.medium};
  }

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    gap: ${({ theme }) => theme.spacing[3]};
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const UserIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  flex: 1 1 ${({ theme }) => theme.size["3xs"]};
  min-width: 0;
`;

export const Avatar = styled.div`
  display: grid;
  place-items: center;

  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  text-transform: uppercase;

  color: ${({ theme }) => theme.primary};
  background-color: color-mix(in srgb, ${({ theme }) => theme.primary} 12%, transparent);
  border: ${({ theme }) => theme.border.thin} solid
    color-mix(in srgb, ${({ theme }) => theme.primary} 32%, transparent);
  border-radius: ${({ theme }) => theme.radius.full};
`;

export const IdentityText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[0.5]};

  min-width: 0;
`;

export const Username = styled.span`
  overflow: hidden;

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Email = styled.span`
  overflow-wrap: anywhere;

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const Badges = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const CreatedAt = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
  white-space: nowrap;
`;

export const Chevron = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  color: ${({ theme }) => theme.text.muted};
`;
