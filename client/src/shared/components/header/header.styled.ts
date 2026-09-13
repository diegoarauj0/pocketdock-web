import styled from "styled-components";
import { fadeInDown } from "@/features/theme/animations";
import { Link } from "react-router";

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;

  ${fadeInDown(0)}

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: ${({ theme }) => theme.size.full};
  height: ${({ theme }) => theme.spacing[16]};
  padding: 0 ${({ theme }) => theme.spacing[6]};

  background-color: color-mix(in srgb, ${({ theme }) => theme.background.dark} 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border-bottom: ${({ theme }) => theme.border.thin} solid ${({ theme }) => theme.borderColor.muted};
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-left: ${({ theme }) => theme.spacing[6]};
`;

export const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  text-decoration: none;
`;

export const BrandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ theme }) => theme.spacing[6]};
  height: ${({ theme }) => theme.spacing[6]};

  color: ${({ theme }) => theme.primary};
`;

export const BrandName = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
  color: ${({ theme }) => theme.text.default};
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const LogoutButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};

  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[3]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};

  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.text.default};
    background-color: ${({ theme }) => theme.background.light};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const SignInLink = styled(Link)`
  display: inline-flex;
  align-items: center;

  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[3]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.inverse.text};
  text-decoration: none;

  background-color: ${({ theme }) => theme.inverse.background};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: color-mix(in srgb, ${({ theme }) => theme.inverse.background} 85%, ${({ theme }) => theme.inverse.text});
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;
