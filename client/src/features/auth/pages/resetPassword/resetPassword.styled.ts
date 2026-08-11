import styled from "styled-components";

export const ResetPasswordWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const FormWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[10]};

  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoint.sm}) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

export const FormCard = styled.div`
  width: min(100%, 448px);
`;

export const Form = styled.form`
  display: grid;
  gap: 20px;
`;

export const StepIndicator = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
`;

export const StepSegment = styled.span<{ $active: boolean }>`
  height: 4px;
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
  font-size: 0.8rem;
`;

export const BackButton = styled.button`
  margin-top: 12px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  font-size: 0.8rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const ResendPrompt = styled.p`
  margin: 20px 0 0;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.8rem;
  text-align: center;
`;

export const ResendButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  font-size: 0.8rem;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
    text-decoration: none;
  }
`;
