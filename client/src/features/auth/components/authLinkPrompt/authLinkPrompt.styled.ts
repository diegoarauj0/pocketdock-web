import styled from "styled-components";
import { Link } from "react-router";

export const Prompt = styled.p`
  margin: 34px 0 0;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.8rem;
  text-align: right;

  @media (max-width: ${({ theme }) => theme.breakpoint.sm}) {
    text-align: center;
  }
`;

export const PromptLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

