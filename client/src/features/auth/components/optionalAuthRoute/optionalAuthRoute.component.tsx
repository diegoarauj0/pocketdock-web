import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { Outlet } from "react-router";

export function OptionalAuthComponent() {
  const { state } = useAuth();

  if (state === "loading") return <LoadingScreenComponent />;

  return <Outlet />;
}
