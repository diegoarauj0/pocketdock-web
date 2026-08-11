import styled from "styled-components";

export const AuthMain = styled.main`
  height: 100vh;
  height: 100dvh;
  width: 100vw;

  overflow-y: auto;

  background-color: ${({ theme }) => theme.background.dark};

  color: ${({ theme }) => theme.text.default};

`;
