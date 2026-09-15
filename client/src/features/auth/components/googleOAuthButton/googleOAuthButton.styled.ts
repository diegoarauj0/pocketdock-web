import styled from "styled-components";

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};

  width: 100%;

  background-color: transparent;
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;

  color: ${({ theme }) => theme.text.default};

  padding: ${({ theme }) => theme.spacing["4"]};

  cursor: pointer;

  font-weight: 600;

  transition: background-color 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.background.light};
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

export const GoogleIcon = styled.svg`
  width: ${({ theme }) => theme.spacing[5]};
  height: ${({ theme }) => theme.spacing[5]};
  flex-shrink: 0;
`;