import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.dark};
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[6]};

  width: ${({ theme }) => theme.size.full};
  max-width: ${({ theme }) => theme.size["3xl"]};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[10]} ${({ theme }) => theme.spacing[6]};
  text-align: center;

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
  }
`;

export const Title = styled.h1`
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  line-height: ${({ theme }) => theme.lineHeight.tight};
  letter-spacing: -0.05em;
  font-weight: 700;
  color: ${({ theme }) => theme.text.default};
`;

export const Description = styled.p`
  max-width: ${({ theme }) => theme.size["lg"]};
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.lg};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: ${({ theme }) => theme.spacing[2]};
`;