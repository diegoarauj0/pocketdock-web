import styled from "styled-components";
import { fadeIn, fadeInUp } from "@/features/theme/animations";

export const EmailVerificationWrapper = styled.div`
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
  ${fadeIn(0)}

  width: min(100%, ${({ theme }) => theme.size["md"]});

  padding: ${({ theme }) => theme.spacing[8]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Form = styled.form`
  ${fadeInUp(260)}

  display: grid;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const ErrorMessage = styled.p``;

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
