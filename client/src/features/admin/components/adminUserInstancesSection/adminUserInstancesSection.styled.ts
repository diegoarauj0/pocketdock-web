import styled from "styled-components";

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    grid-template-columns: minmax(0, 1fr);
  }
`;
