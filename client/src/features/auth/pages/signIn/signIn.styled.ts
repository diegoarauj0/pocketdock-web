import styled from "styled-components";

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