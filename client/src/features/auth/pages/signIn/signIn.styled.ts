import styled from "styled-components";
import { fadeIn, fadeInUp } from "@/features/theme/animations";

export const SignInWrapper = styled.div`
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

export const OAuthDivider = styled.div`
  ${fadeInUp(320)}

  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};

  margin: ${({ theme }) => theme.spacing[6]} 0;

  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

export const OAuthDividerLine = styled.span`
  flex: 1;
  height: ${({ theme }) => theme.border.thin};
  background-color: ${({ theme }) => theme.borderColor.muted};
`;

export const OAuthSection = styled.div`
  ${fadeInUp(360)}
`;

export const OAuthErrorMessage = styled.p`
  margin: ${({ theme }) => theme.spacing[3]} 0 0;
  color: ${({ theme }) => theme.danger};
  font-size: ${({ theme }) => theme.fontSize.xs};
  text-align: center;
`;