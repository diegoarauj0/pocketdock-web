import styled from "styled-components";

export const Field = styled.div`
  display: grid;
  gap: 8px;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.text.default};
  font-size: 0.875rem;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  height: 44px;
  padding: 0 13px;
  border: 1px solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;
  background: ${({ theme }) => theme.background.dark};
  color: ${({ theme }) => theme.text.default};
  font-size: 0.875rem;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
    opacity: 0.78;
  }
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px color-mix(in oklch, ${({ theme }) => theme.primary} 18%, transparent);
  }
  ${({ theme, $hasError }) =>
    $hasError &&
    `
    border-color: ${theme.danger};
    &:focus {
      border-color: ${theme.danger};
      box-shadow: 0 0 0 3px color-mix(in oklch, ${theme.danger} 18%, transparent);
    }
  `}
`;

export const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.danger};
  font-size: 0.8rem;
`;
