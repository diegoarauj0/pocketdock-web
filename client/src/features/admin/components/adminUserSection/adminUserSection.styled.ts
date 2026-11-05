import { fadeInUp } from "@/features/theme/animations";
import styled from "styled-components";

export const Section = styled.section`
  ${fadeInUp(160)}

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  min-width: 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const SectionHeaderActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
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

export const SectionCount = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
  white-space: nowrap;
`;
