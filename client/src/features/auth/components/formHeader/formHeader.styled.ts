import styled from "styled-components";

export const Brand = styled.div`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.primary};
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.035em;
`;

export const Subtitle = styled.p`
  margin: 12px 0 36px;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.95rem;
  line-height: 1.55;
`;