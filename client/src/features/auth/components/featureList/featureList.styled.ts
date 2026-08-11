import styled from "styled-components";

export const FeatureList = styled.div`
  margin-top: 36px;
  display: grid;
  gap: 16px;
`;

export const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.875rem;

  svg {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    color: ${({ theme }) => theme.primary};
    stroke-width: 1.8;
  }
`;
