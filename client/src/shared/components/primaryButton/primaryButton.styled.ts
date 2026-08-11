import styled from "styled-components";

export const Button = styled.button`
  background-color: ${({ theme }) => theme.primary};
  
  border: none;
  outline: none;

  color: black;

  padding: ${({ theme }) => theme.spacing["4"]};

  cursor: pointer;

  border-radius: ${({ theme }) => theme.radius.md};

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
