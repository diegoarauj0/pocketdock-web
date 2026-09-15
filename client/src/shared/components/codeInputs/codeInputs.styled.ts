import styled from "styled-components";

export const CodeInputs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const CodeInput = styled.input`
  height: ${({ theme }) => theme.spacing[14]};
  width: ${({ theme }) => theme.size.full};
  min-width: 0;
  padding: 0;

  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;

  background: ${({ theme }) => theme.background.dark};
  color: ${({ theme }) => theme.text.default};

  font-size: ${({ theme }) => theme.fontSize.xl};
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
