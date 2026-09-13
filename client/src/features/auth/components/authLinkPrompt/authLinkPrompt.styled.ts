import styled from "styled-components";
import { fadeInUp } from "@/features/theme/animations";
import { Link } from "react-router";

export const Prompt = styled.p`
  ${fadeInUp(320)}

  margin: ${({ theme }) => theme.spacing[8]} 0 0;
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.xs};
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