import styled from "styled-components";

export const IntroPanel = styled.section`
  display: flex;

  padding: ${({ theme }) => theme.spacing[10]};

  height: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoint.sm}) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

export const IntroContent = styled.div`
  flex-direction: row;
  display: flex;

  width: 100%;
`;

export const Headline = styled.h1`
  margin: none;
  font-size: clamp(2.25rem, 4vw, 3.75rem);
  line-height: 1.12;
  letter-spacing: -0.045em;
  font-weight: 650;

  text-align: center;
`;

export const Description = styled.p`
  max-width: 480px;
  margin: 28px 0 0;
  color: ${({ theme }) => theme.text.muted};
  font-size: 1rem;
  line-height: 1.55;

  text-align: center;
`;

export const LeftWrapper = styled.div`
  width: ${({ theme }) => theme.size["5xl"]};

  padding: ${({ theme }) => theme.spacing[10]};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
    display: none;
  }
`;
