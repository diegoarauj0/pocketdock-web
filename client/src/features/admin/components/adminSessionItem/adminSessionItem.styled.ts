import styled from "styled-components";
import { fadeInUp } from "@/features/theme/animations";

export const Item = styled.article`
  ${fadeInUp(0)}

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  min-width: 0;
  padding: ${({ theme }) => theme.spacing[5]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const CreatedAt = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Detail = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};

  min-width: 0;
`;

export const DetailIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing[5]};
  height: ${({ theme }) => theme.spacing[5]};
  margin-top: ${({ theme }) => theme.spacing[0.5]};

  color: ${({ theme }) => theme.text.muted};
`;

export const DetailText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[0.5]};

  min-width: 0;
`;

export const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const DetailValue = styled.span`
  overflow-wrap: anywhere;

  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.default};
`;

export const SessionId = styled.span`
  overflow-wrap: anywhere;

  padding-top: ${({ theme }) => theme.spacing[3]};

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};

  border-top: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
`;
