import styled, { keyframes } from "styled-components";

export const CodeBoxRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const CodeBox = styled.div<{ $filled?: boolean; $active?: boolean }>`
  flex: 1;
  height: ${({ theme }) => theme.spacing[14]};
  min-width: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: ${({ theme }) => theme.border.thin} solid
    ${({ theme, $filled }) => ($filled ? theme.primary : theme.borderColor.muted)};
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.background.dark};
  color: ${({ theme }) => theme.text.default};

  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;

  ${({ theme, $active }) =>
    $active &&
    `
      border-color: ${theme.primary};
      box-shadow: 0 0 0 3px color-mix(in oklch, ${theme.primary} 18%, transparent);
    `}
`;

const caretBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

export const CodeCaret = styled.span`
  width: 1px;
  height: ${({ theme }) => theme.spacing[7]};
  background: ${({ theme }) => theme.text.default};
  animation: ${caretBlink} 1.2s ease-in-out infinite;
`;