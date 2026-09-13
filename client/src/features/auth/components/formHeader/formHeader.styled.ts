import styled from "styled-components";

export const Brand = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  color: ${({ theme }) => theme.primary};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  line-height: ${({ theme }) => theme.lineHeight.tight};
  letter-spacing: -0.03em;
  font-weight: 650;
`;

export const Subtitle = styled.p`
  margin: ${({ theme }) => theme.spacing[3]} 0 ${({ theme }) => theme.spacing[9]};
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
`;