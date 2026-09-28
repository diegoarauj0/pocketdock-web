import * as Styled from "./auth.styled";
import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <Styled.AuthMain>
      <Outlet />
    </Styled.AuthMain>
  );
}
