import styled from "styled-components";

export const CodeInputs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  height: 56px;
  padding: 0;

  border: 1px solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;

  background: ${({ theme }) => theme.background.dark};
  color: ${({ theme }) => theme.text.default};

  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-align: center;
  text-transform: uppercase;

  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px color-mix(in oklch, ${({ theme }) => theme.primary} 18%, transparent);
  }
`;
