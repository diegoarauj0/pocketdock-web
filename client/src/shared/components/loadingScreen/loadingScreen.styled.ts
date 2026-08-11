import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Wrapper = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.background.dark};
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.borderColor.muted};
  border-top-color: ${({ theme }) => theme.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  animation: ${spin} 700ms linear infinite;
`;
