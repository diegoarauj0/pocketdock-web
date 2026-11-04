import type { InterfaceInstanceLifecycleStatus } from "@/features/instances/services/instances.service";
import { resolveInstanceStatusColor } from "@/features/instances/utils/instanceStatus.util";
import { fadeInUp } from "@/features/theme/animations";
import styled from "styled-components";
import { Link } from "react-router";

export const Card = styled.article`
  ${fadeInUp(0)}

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};

  min-width: 0;
  padding: ${({ theme }) => theme.spacing[5]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};

  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.borderColor.default};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const IconArea = styled.div<{ $status: InterfaceInstanceLifecycleStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};

  color: ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)};
  background-color: ${({ theme, $status }) =>
    `color-mix(in srgb, ${resolveInstanceStatusColor(theme, $status)} 12%, transparent)`};
  border: ${({ theme }) => theme.border.thin} solid
    ${({ theme, $status }) => `color-mix(in srgb, ${resolveInstanceStatusColor(theme, $status)} 32%, transparent)`};
  border-radius: ${({ theme }) => theme.radius.md};
`;

export const Name = styled.h3`
  overflow: hidden;

  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Id = styled.span`
  overflow-wrap: anywhere;

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const OwnerLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1.5]};

  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.default};
  text-decoration: none;

  background-color: ${({ theme }) => theme.background.light};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.md};

  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const OwnerEmail = styled.span`
  overflow-wrap: anywhere;

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const UrlLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};

  overflow-wrap: anywhere;

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const UrlPlaceholder = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};

  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
`;

export const MetaLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const MetaValue = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.default};
  text-align: right;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;
