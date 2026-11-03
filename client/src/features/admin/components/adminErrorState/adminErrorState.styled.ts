import styled from "styled-components";
import { fadeInUp } from "@/features/theme/animations";

export const ErrorState = styled.div`
  ${fadeInUp(80)}

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};

  padding: ${({ theme }) => theme.spacing[6]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.danger};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  color: ${({ theme }) => theme.danger};
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
`;

export const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.muted};
`;

export const RetryButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;

  color: ${({ theme }) => theme.text.default};
  background-color: ${({ theme }) => theme.background.light};

  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.default};
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;
