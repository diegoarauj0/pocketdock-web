import styled from "styled-components";
import { Link } from "react-router";

export const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  text-decoration: none;

  cursor: pointer;

  width: ${({ theme }) => theme.size["md"]};
  padding: ${({ theme }) => theme.spacing[5]};

  background-color: ${({ theme }) => theme.background.default};
  border: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
  border-radius: ${({ theme }) => theme.radius.lg};

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.highlight};
    box-shadow: 0 0 0 ${({ theme }) => theme.border.thin} ${({ theme }) => theme.highlight};
  }
`;

export const Header = styled.div`
  display: grid;

  align-items: center;

  gap: ${({ theme }) => theme.spacing[2.5]};
  grid-template-columns: ${({ theme }) => theme.spacing[12]} 1fr;
  grid-template-rows: 1fr;

  height: ${({ theme }) => theme.spacing[12]};
`;

export const IconArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};

  background-color: color-mix(in oklch, ${({ theme }) => theme.primary} 18%, transparent);
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.primary};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const Name = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};
  word-break: break-word;
`;

export const Id = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
  word-break: break-all;
`;

export const MetaList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  margin-top: auto;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text.muted};
`;

export const Label = styled.dt``;

export const Value = styled.dd`
  color: ${({ theme }) => theme.text.default};
`;
