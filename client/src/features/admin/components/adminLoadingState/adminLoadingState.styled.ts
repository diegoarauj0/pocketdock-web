import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  min-height: ${({ theme }) => theme.spacing[40]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
`;

export const Spinner = styled.span`
  width: ${({ theme }) => theme.spacing[4]};
  height: ${({ theme }) => theme.spacing[4]};

  border: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.borderColor.muted};
  border-top-color: ${({ theme }) => theme.primary};
  border-radius: ${({ theme }) => theme.radius.full};

  animation: ${spin} 700ms linear infinite;
`;
