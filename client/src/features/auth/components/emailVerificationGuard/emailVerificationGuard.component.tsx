import { Navigate, Outlet, useLocation } from "react-router";
import { APP_PATH } from "@/app/app.path";

interface InterfaceEmailLocationState {
  email?: string;
}

export function EmailVerificationGuardComponent() {
  const location = useLocation();
  const stateEmail = (location.state as InterfaceEmailLocationState | null)?.email;

  if (typeof stateEmail !== "string" || stateEmail.trim() === "") {
    return <Navigate to={APP_PATH.AUTH.SIGN_UP} replace />;
  }

  return <Outlet />;
}
