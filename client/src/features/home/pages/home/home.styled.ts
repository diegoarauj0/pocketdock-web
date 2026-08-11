import styled from "styled-components";

export const HomeWrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.text.default};
`;
