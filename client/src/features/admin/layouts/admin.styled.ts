import styled from "styled-components";
import { fadeInUp } from "@/features/theme/animations";
import { NavLink } from "react-router";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.dark};
`;

export const Layout = styled.div`
  ${fadeInUp(0)}

  display: grid;
  grid-template-columns: ${({ theme }) => theme.size["3xs"]} minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing[12]};

  width: ${({ theme }) => theme.size.full};
  max-width: ${({ theme }) => theme.size["7xl"]};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[20]};

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.md})`} {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing[8]};

    padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[16]};
  }
`;

export const BackBar = styled.div`
  width: ${({ theme }) => theme.size.full};
  max-width: ${({ theme }) => theme.size["7xl"]};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[5]} ${({ theme }) => theme.spacing[6]} 0;

  @media ${({ theme }) => `(max-width: ${theme.breakpoint.sm})`} {
    padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]} 0;
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};

  margin-left: -${({ theme }) => theme.spacing[2.5]};
  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[2.5]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text.muted};

  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.text.default};
    background-color: ${({ theme }) => theme.background.light};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};

  align-self: start;

  @media ${({ theme }) => `(min-width: ${theme.breakpoint.md})`} {
    position: sticky;
    top: ${({ theme }) => theme.spacing[24]};
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1.5]};
`;

export const SidebarEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};

  width: fit-content;
  padding: ${({ theme }) => theme.spacing[0.5]} ${({ theme }) => theme.spacing[2]};

  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  color: ${({ theme }) => theme.primary};
  background-color: color-mix(in srgb, ${({ theme }) => theme.primary} 12%, transparent);
  border: ${({ theme }) => theme.border.thin} solid
    color-mix(in srgb, ${({ theme }) => theme.primary} 32%, transparent);
  border-radius: ${({ theme }) => theme.radius.full};
`;

export const SidebarTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text.default};
`;

export const SidebarDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  color: ${({ theme }) => theme.text.muted};
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2.5]};

  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  text-decoration: none;
  color: ${({ theme }) => theme.text.muted};

  border-radius: ${({ theme }) => theme.radius.md};

  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.text.default};
    background-color: ${({ theme }) => theme.background.light};
  }

  &.active {
    color: ${({ theme }) => theme.text.default};
    background-color: ${({ theme }) => theme.background.light};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.border.medium} solid ${({ theme }) => theme.primary};
    outline-offset: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};

  min-width: 0;
`;
