import styled from "styled-components";

export const FeatureList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[9]};
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3.5]};
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};

  svg {
    width: ${({ theme }) => theme.spacing[4]};
    height: ${({ theme }) => theme.spacing[4]};
    flex: 0 0 auto;
    color: ${({ theme }) => theme.primary};
    stroke-width: 1.8;
  }
`;