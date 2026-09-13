import styled from "styled-components";

export const ResetPasswordWrapper = styled.div`
  width: ${({ theme }) => theme.size.full};
  height: ${({ theme }) => theme.size.full};
`;

export const FormWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[10]};

  width: ${({ theme }) => theme.size.full};

  @media (max-width: ${({ theme }) => theme.breakpoint.sm}) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

export const FormCard = styled.div`
  width: min(100%, ${({ theme }) => theme.size["md"]});

  padding: ${({ theme }) => theme.spacing[8]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const StepIndicator = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[7]};
`;

export const StepSegment = styled.span<{ $active: boolean }>`
  height: ${({ theme }) => theme.spacing[1]};
  flex: 1;
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme, $active }) => ($active ? theme.primary : theme.borderColor.muted)};
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  transition:
    background-color 160ms ease,
    opacity 160ms ease;
`;

export const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.danger};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

export const BackButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing[3]};
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  font-size: ${({ theme }) => theme.fontSize.xs};

  &:hover {
    text-decoration: underline;
  }
`;

export const ResendPrompt = styled.p`
  margin: ${({ theme }) => theme.spacing[5]} 0 0;
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.xs};
  text-align: center;
`;

export const ResendButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  font-size: ${({ theme }) => theme.fontSize.xs};

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
    text-decoration: none;
  }
`;