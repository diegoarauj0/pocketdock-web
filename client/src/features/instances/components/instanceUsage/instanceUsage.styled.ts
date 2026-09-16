import { fadeInUp } from "@/features/theme/animations";
import styled from "styled-components";

export const InstanceUsage = styled.div`
  ${fadeInUp(360)}

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: ${({ theme }) => theme.spacing[36]};

  justify-content: space-around;

  gap: ${({ theme }) => theme.spacing[5]};
`;

export const UsageCard = styled.div`
  background-color: ${({ theme }) => theme.background.light};

  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.default};
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

  width: ${({ theme }) => theme.size.full};

  text-align: center;
`;
