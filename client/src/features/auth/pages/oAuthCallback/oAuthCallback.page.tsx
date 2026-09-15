import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { notificationService } from "@/shared/services/notification.service";
import { OAUTH_CONSTANT } from "../../constants/oauth.constant";
import { useAuth } from "../../contexts/auth.context";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import { useEffect } from "react";

const SUCCESS_REDIRECT_QUERY_KEY = OAUTH_CONSTANT.SUCCESS_REDIRECT_QUERY_KEY;
const SUCCESS_REDIRECT_QUERY_VALUE = OAUTH_CONSTANT.SUCCESS_REDIRECT_QUERY_VALUE;

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const successOAuth = searchParams.get(SUCCESS_REDIRECT_QUERY_KEY) === SUCCESS_REDIRECT_QUERY_VALUE;

    if (successOAuth) {
      notificationService.success("Login bem sucedido.");
    }

    if (state === "authenticated") {
      navigate(APP_PATH.INSTANCES, { replace: true });
    }
  }, [state, navigate]);

  if (state === "loading") {
    return <LoadingScreenComponent />;
  }

  if (state === "unauthenticated") {
    navigate(APP_PATH.AUTH.SIGN_IN, { replace: true });
    return null;
  }

  return null;
}
