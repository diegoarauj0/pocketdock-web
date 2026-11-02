import styled from "styled-components";

export const Group = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;

  padding: 3px;

  background-color: ${({ theme }) => theme.background.light};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    width: ${({ theme }) => theme.size.full};
  }
`;

export const Option = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1.5]};

  min-height: ${({ theme }) => theme.spacing[7]};
  padding: 0 ${({ theme }) => theme.spacing[3]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  white-space: nowrap;

  color: ${({ theme, $active }) => ($active ? theme.text.default : theme.text.muted)};

  background-color: ${({ theme, $active }) => ($active ? theme.background.default : "transparent")};
  border: ${({ theme }) => theme.border.thin} solid
    ${({ theme, $active }) => ($active ? theme.borderColor.muted : "transparent")};
  border-radius: ${({ theme }) => theme.radius.md};

  box-shadow: ${({ $active }) => ($active ? "0 1px 2px rgba(0, 0, 0, 0.18)" : "none")};

  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.text.default};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    flex: 1;
  }
`;
