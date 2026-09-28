import styled from "styled-components";
import { fadeInUp } from "@/features/theme/animations";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.dark};
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};

  width: ${({ theme }) => theme.size.full};
  max-width: ${({ theme }) => theme.size["6xl"]};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[6]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  }
`;

export const InstancesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const Title = styled.h1`
  ${fadeInUp(0)}

  font-size: ${({ theme }) => theme.fontSize["2xl"]};
  font-weight: 700;
  color: ${({ theme }) => theme.text.default};
`;

export const Subtitle = styled.span`
  ${fadeInUp(80)}

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
`;

export const NewButton = styled.button`
  ${fadeInUp(160)}

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1.5]};

  min-width: ${({ theme }) => theme.spacing[36]};
  height: ${({ theme }) => theme.spacing[10]};
  padding: 0 ${({ theme }) => theme.spacing[4]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.inverse.text};

  background-color: ${({ theme }) => theme.inverse.background};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    background-color: color-mix(
      in srgb,
      ${({ theme }) => theme.inverse.background} 85%,
      ${({ theme }) => theme.inverse.text}
    );
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const CardsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[5]};
`;
