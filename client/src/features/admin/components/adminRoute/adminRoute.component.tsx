import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { APP_PATH } from "@/app/app.path";
import { Navigate, Outlet } from "react-router";

export function AdminRouteComponent() {
  const { state, user } = useAuth();

  if (state === "loading") return <LoadingScreenComponent />;

  if (state === "unauthenticated") {
    return (
      <>
        <LoadingScreenComponent />
        <Navigate to={APP_PATH.AUTH.SIGN_IN} replace />
      </>
    );
  }

  if (user?.isAdmin !== true) {
    return <Navigate to={APP_PATH.HOME} replace />;
  }

  return <Outlet />;
}
