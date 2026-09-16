import styled from "styled-components";
import { fadeInUp } from "@/features/theme/animations";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.dark};
`;

export const Content = styled.main<{ $error?: boolean }>`
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

export const InstanceHeader = styled.div`
  display: grid;

  grid-template-rows: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[20]} ${({ theme }) =>
      theme.spacing[10]};
  grid-template-columns: ${({ theme }) => theme.spacing[36]} auto auto;
`;

export const PreviewLink = styled.div`
  ${fadeInUp(0)}

  grid-column: 1 / 4;

  display: flex;
  justify-content: start;
  align-items: center;

  a {
    color: ${({ theme }) => theme.text.muted};

    text-decoration: none;

    display: flex;
    align-items: center;
  }
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  grid-column: 1 / 3;
`;

export const Title = styled.h1`
  ${fadeInUp(80)}

  font-size: ${({ theme }) => theme.fontSize["2xl"]};
  color: ${({ theme }) => theme.text.default};
  font-weight: 700;
`;

export const Subtitle = styled.span`
  ${fadeInUp(160)}

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
`;

export const Status = styled.div<{ $isRunning: boolean }>`
  ${fadeInUp(320)}

  background-color: ${({ theme }) => theme.background.light};

  border-radius: ${({ theme }) => theme.radius.full};
  border: ${({ theme }) => theme.border.thin} solid
    ${({ theme, $isRunning }) => ($isRunning ? theme.success : theme.text.muted)};

  color: ${({ theme, $isRunning }) => ($isRunning ? theme.text.default : theme.text.muted)};

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonGroup = styled.div`
  ${fadeInUp(240)}

  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const DeleteInstance = styled.button`
  background-color: ${({ theme }) => theme.danger};

  color: ${({ theme }) => theme.onPrimary};

  border: none;
  border-radius: ${({ theme }) => theme.radius.md};

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};

  svg {
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

export const StartOrStopInstance = styled.button<{ $stop?: boolean }>`
  background-color: transparent;

  color: ${({ theme, $stop }) => ($stop ? theme.danger : theme.text.default)};

  border: ${({ theme }) => theme.border.thin} solid
    ${({ theme, $stop }) => ($stop ? theme.danger : theme.borderColor.default)};
  border-radius: ${({ theme }) => theme.radius.md};

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};

  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.background.light};
    border-color: ${({ theme }) => theme.highlight};
  }

  svg {
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;







export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};

  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[6]};
`;

export const ErrorIcon = styled.div`
  ${fadeInUp(0)}

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.danger};

  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const ErrorTitle = styled.h2`
  ${fadeInUp(80)}

  color: ${({ theme }) => theme.text.default};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 600;
  letter-spacing: -0.01em;

  text-align: center;
`;

export const ErrorMessage = styled.p`
  ${fadeInUp(160)}

  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};

  text-align: center;

  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const ErrorBackLink = styled.div`
  ${fadeInUp(240)}

  display: flex;
  justify-content: center;
  align-items: center;

  a {
    color: ${({ theme }) => theme.text.muted};

    text-decoration: none;

    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};

    font-size: ${({ theme }) => theme.fontSize.sm};

    transition: color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.text.default};
    }
  }
`;
