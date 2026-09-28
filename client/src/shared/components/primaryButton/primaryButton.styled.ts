import styled from "styled-components";

export const Button = styled.button`
  background-color: ${({ theme }) => theme.inverse.background};

  border: none;
  outline: none;

  color: ${({ theme }) => theme.inverse.text};

  padding: ${({ theme }) => theme.spacing["4"]};

  cursor: pointer;

  border-radius: ${({ theme }) => theme.radius.md};

  font-weight: 600;

  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      ${({ theme }) => theme.inverse.background} 85%,
      ${({ theme }) => theme.inverse.text}
    );
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
