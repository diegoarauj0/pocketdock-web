import styled from "styled-components";

export const FieldValue = styled.span`
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
`;

export const CopyableValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const CopyButton = styled.button`
  background-color: ${({ theme }) => theme.background.dark};

  color: ${({ theme }) => theme.text.muted};

  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.md};

  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};

  cursor: pointer;

  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: nowrap;

  transition:
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.text.default};
    border-color: ${({ theme }) => theme.highlight};
  }
`;
