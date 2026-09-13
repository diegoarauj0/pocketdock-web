import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0px;
    margin: 0px;
  }

  html, body, #root {
    min-height: ${({ theme }) => theme.size.full};
  }

  body {
    background: ${({ theme }) => theme.background.dark};
    color: ${({ theme }) => theme.text.default};
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  button, input {
    font: inherit;
  }
`;
