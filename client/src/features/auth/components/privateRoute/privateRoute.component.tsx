import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { APP_PATH } from "@/app/app.path";
import { Navigate, Outlet } from "react-router";

export function PrivateRouteComponent() {
  const { state } = useAuth();

  if (state === "loading") return <LoadingScreenComponent />;

  if (state === "unauthenticated") {
    return (
      <>
        <LoadingScreenComponent />
        <Navigate to={APP_PATH.AUTH.SIGN_IN} replace />
      </>
    );
  }

  return <Outlet />;
}
