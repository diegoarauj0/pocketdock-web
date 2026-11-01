import type { InterfaceInstanceLifecycleStatus } from "@/features/instances/services/instances.service";
import { resolveInstanceStatusColor } from "@/features/instances/utils/instanceStatus.util";
import styled, { css, keyframes } from "styled-components";
import { Link } from "react-router";

const statusPulse = keyframes`
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.35;
  }
`;

export const Card = styled(Link)<{ $status: InterfaceInstanceLifecycleStatus }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  text-decoration: none;

  cursor: pointer;

  width: ${({ theme }) => theme.size["md"]};
  padding: ${({ theme }) => theme.spacing[5]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid
    ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)};
  border-radius: ${({ theme }) => theme.radius.lg};

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 0 0 ${({ theme }) => theme.border.thin}
      ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)};
  }
`;

export const Header = styled.div`
  display: grid;

  align-items: center;

  gap: ${({ theme }) => theme.spacing[2.5]};
  grid-template-columns: ${({ theme }) => theme.spacing[12]} 1fr;
  grid-template-rows: 1fr;

  height: ${({ theme }) => theme.spacing[12]};
`;

export const IconArea = styled.div<{ $status: InterfaceInstanceLifecycleStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};

  background-color: color-mix(
    in oklch,
    ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)} 18%,
    transparent
  );
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const Name = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};
  word-break: break-word;
`;

export const Id = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
  word-break: break-all;
`;

export const StatusBadge = styled.span<{ $status: InterfaceInstanceLifecycleStatus }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};

  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2.5]};

  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 500;
  color: ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)};

  background-color: color-mix(
    in oklch,
    ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)} 14%,
    transparent
  );
  border: ${({ theme }) => theme.border.thin} solid
    color-mix(in oklch, ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)} 40%, transparent);
  border-radius: ${({ theme }) => theme.radius.full};
`;

export const StatusDot = styled.span<{ $status: InterfaceInstanceLifecycleStatus }>`
  flex-shrink: 0;

  width: ${({ theme }) => theme.spacing[2]};
  height: ${({ theme }) => theme.spacing[2]};

  background-color: ${({ theme, $status }) => resolveInstanceStatusColor(theme, $status)};
  border-radius: ${({ theme }) => theme.radius.full};

  ${({ $status }) =>
    $status === "pending" &&
    css`
      animation: ${statusPulse} 1.4s ease-in-out infinite;
    `}
`;

export const MetaList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  margin-top: auto;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const Label = styled.dt``;

export const Value = styled.dd`
  color: ${({ theme }) => theme.text.default};
`;
