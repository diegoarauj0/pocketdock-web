import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[6]};

  padding: ${({ theme }) => theme.spacing[5]} ${({ theme }) => theme.spacing[6]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing[4]};

    padding: ${({ theme }) => theme.spacing[5]};
  }
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  min-width: 0;
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.text.default};
`;

export const Description = styled.p`
  max-width: ${({ theme }) => theme.size["md"]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.muted};
`;

export const Control = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    width: ${({ theme }) => theme.size.full};
  }
`;
