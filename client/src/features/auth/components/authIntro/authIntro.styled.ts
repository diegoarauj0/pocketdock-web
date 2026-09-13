import styled from "styled-components";

export const IntroPanel = styled.section`
  display: flex;

  padding: ${({ theme }) => theme.spacing[10]};

  height: ${({ theme }) => theme.size.full};

  @media (max-width: ${({ theme }) => theme.breakpoint.sm}) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

export const IntroContent = styled.div`
  flex-direction: row;
  display: flex;

  width: ${({ theme }) => theme.size.full};
`;

export const Headline = styled.h1`
  margin: none;
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  line-height: ${({ theme }) => theme.lineHeight.tight};
  letter-spacing: -0.05em;
  font-weight: 700;

  text-align: left;
`;

export const Description = styled.p`
  max-width: ${({ theme }) => theme.size["md"]};
  margin: ${({ theme }) => theme.spacing[6]} 0 0;
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};

  text-align: left;
`;

export const LeftWrapper = styled.div`
  width: ${({ theme }) => theme.size["5xl"]};

  padding: ${({ theme }) => theme.spacing[10]} ${({ theme }) => theme.spacing[8]};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
    display: none;
  }
`;