import { fadeInUp } from "@/features/theme/animations";
import styled from "styled-components";
import { Link } from "react-router";

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
