import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.dark};
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};

  width: 100%;
  max-width: 1140px;
  margin: none auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[6]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  }
`;

export const InstanceHeader = styled.div`
  display: grid;

  grid-template-rows: 50px 80px 40px;
  grid-template-columns: 150px auto 250px;
`;

export const PreviewLink = styled.div`
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
  font-size: ${({ theme }) => theme.fontSize["2xl"]};
  color: ${({ theme }) => theme.text.default};
  font-weight: 700;
`;

export const Subtitle = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};
`;

export const Status = styled.div`
  background-color: ${({ theme }) => theme.background.light};

  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.success};

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DeleteInstance = styled.button`
  background-color: ${({ theme }) => theme.danger};

  color: ${({ theme }) => theme.text.default};

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

export const PauseOrResumeInstance = styled.button`
  background-color: ${({ theme }) => theme.background.light};

  color: ${({ theme }) => theme.text.default};

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

export const InstanceUsage = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 150px;

  justify-content: space-around;

  gap: ${({ theme }) => theme.spacing[5]};
`;

export const UsageCard = styled.div`
  background-color: ${({ theme }) => theme.background.light};

  border: 1px solid ${({ theme }) => theme.borderColor.default};
  border-radius: ${({ theme }) => theme.radius.lg};

  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export const UsageTitle = styled.h2`
  color: ${({ theme }) => theme.text.muted};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 400;

  display: flex;
  align-items: center;

  margin-bottom: ${({ theme }) => theme.spacing[2]};

  svg {
    color: ${({ theme }) => theme.primary};
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

export const Usage = styled.p`
  color: ${({ theme }) => theme.text.default};
  font-size: ${({ theme }) => theme.fontSize["3xl"]};
  font-weight: 600;

  width: 100%;

  text-align: center;
`;
