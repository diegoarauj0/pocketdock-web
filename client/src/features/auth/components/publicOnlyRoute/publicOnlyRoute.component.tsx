import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { APP_PATH } from "@/app/app.path";
import { Navigate, Outlet } from "react-router";

export function PublicOnlyRouteComponent() {
  const { state, user } = useAuth();

  if (state === "loading") return <LoadingScreenComponent />;

  if (state === "authenticated" && user !== null) {
    return (
      <>
        <LoadingScreenComponent />
        <Navigate to={APP_PATH.HOME} replace />
      </>
    );
  }

  return <Outlet />;
}
