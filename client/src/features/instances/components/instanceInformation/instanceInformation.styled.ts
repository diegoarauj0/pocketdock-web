import { fadeInUp } from "@/features/theme/animations";
import styled from "styled-components";

export const InstanceInformation = styled.div`
  ${fadeInUp(440)}

  background-color: ${({ theme }) => theme.background.default};

  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.default};
  border-radius: ${({ theme }) => theme.radius.lg};

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};

  padding: ${({ theme }) => theme.spacing[6]};

  > *:first-child {
    grid-column: 1 / -1;
  }
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  grid-column: 1 / 3;
`;

export const Title = styled.h1`
  ${fadeInUp(80)}

  font-size: ${({ theme }) => theme.fontSize["2xl"]};
  color: ${({ theme }) => theme.text.default};
  font-weight: 700;
`;

export const InstanceRow = styled.div<{ $full?: boolean }>`
  background-color: transparent;

  grid-column: ${({ $full }) => ($full === true ? "1 / 3" : "0 / 1")};

  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.md};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  padding: ${({ theme }) => theme.spacing[4]};

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  background-color: ${({ theme }) => theme.background.light};

  &:hover {
    border-color: ${({ theme }) => theme.borderColor.default};
  }
`;

export const FieldLabel = styled.span`
  color: ${({ theme }) => theme.text.default};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 500;
  letter-spacing: -0.01em;
`;

export const FieldValue = styled.span`
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
`;

export const CredentialsNotice = styled.p`
  grid-column: 1 / -1;

  color: ${({ theme }) => theme.warning};

  font-size: ${({ theme }) => theme.fontSize.sm};

  margin: 0;
`;

export const LoginNotice = styled.p`
  grid-column: 1 / -1;

  color: ${({ theme }) => theme.text.muted};

  font-size: ${({ theme }) => theme.fontSize.sm};

  margin: 0;
`;
