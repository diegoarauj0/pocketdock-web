import styled from "styled-components";

export const SignInWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const FormWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme}) => theme.spacing[10]};

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
