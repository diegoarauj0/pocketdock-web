import styled from "styled-components";

export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};

  padding-top: ${({ theme }) => theme.spacing[2]};
`;

export const Info = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const PageInfo = styled.span`
  min-width: ${({ theme }) => theme.spacing[20]};
  text-align: center;

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: ${({ theme }) => theme.spacing[9]};
  height: ${({ theme }) => theme.spacing[9]};

  color: ${({ theme }) => theme.text.default};
  background-color: ${({ theme }) => theme.background.default};

  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.background.light};
    border-color: ${({ theme }) => theme.borderColor.default};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
