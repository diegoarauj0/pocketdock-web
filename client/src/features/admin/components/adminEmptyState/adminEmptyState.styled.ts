import styled from "styled-components";
import { fadeInUp } from "@/features/theme/animations";

export const EmptyState = styled.div`
  ${fadeInUp(80)}

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[6]};
  text-align: center;

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} dashed ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  color: ${({ theme }) => theme.text.muted};
  background-color: ${({ theme }) => theme.background.light};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.full};
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};
`;

export const Description = styled.p`
  max-width: ${({ theme }) => theme.size.sm};

  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.muted};
`;
