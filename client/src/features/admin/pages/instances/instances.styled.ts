import { fadeInUp } from "@/features/theme/animations";
import styled from "styled-components";

export const SectionHeader = styled.div`
  ${fadeInUp(80)}

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1.5]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.text.default};
`;

export const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.muted};
`;

export const CardsGrid = styled.div`
  ${fadeInUp(160)}

  display: grid;
  grid-template-columns: repeat(1fr);
  gap: ${({ theme }) => theme.spacing[4]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    grid-template-columns: minmax(0, 1fr);
  }
`;
