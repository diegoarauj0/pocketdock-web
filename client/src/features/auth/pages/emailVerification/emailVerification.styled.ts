import styled from "styled-components";

export const EmailVerificationWrapper = styled.div`
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

export const ErrorMessage = styled.p``

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