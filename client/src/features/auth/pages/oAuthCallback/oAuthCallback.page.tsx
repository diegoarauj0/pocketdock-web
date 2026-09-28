import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { notificationService } from "@/shared/services/notification.service";
import { AUTH_CONSTANT } from "../../constants/auth.constant";
import { OAUTH_CONSTANT } from "../../constants/oauth.constant";
import { useAuth } from "../../contexts/auth.context";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import { useEffect } from "react";

const SUCCESS_REDIRECT_QUERY_KEY = OAUTH_CONSTANT.SUCCESS_REDIRECT_QUERY_KEY;
const SUCCESS_REDIRECT_QUERY_VALUE = OAUTH_CONSTANT.SUCCESS_REDIRECT_QUERY_VALUE;
const OAUTH_SIGN_IN_NOTIFICATION_ID = AUTH_CONSTANT.NOTIFICATION_IDS.OAUTH_SIGN_IN;

export function OAuthCallbackPage() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const successOAuth = searchParams.get(SUCCESS_REDIRECT_QUERY_KEY) === SUCCESS_REDIRECT_QUERY_VALUE;

    if (!successOAuth) return;

    setTimeout(() => {
      notificationService.success(t("OAUTH_LOGIN_SUCCESS"), OAUTH_SIGN_IN_NOTIFICATION_ID);
    }, 350);
  }, [t]);

  useEffect(() => {
    if (state === "loading") return;

    if (state === "authenticated") {
      navigate(APP_PATH.INSTANCES, { replace: true });
      return;
    }

    navigate(APP_PATH.AUTH.SIGN_IN, { replace: true });
  }, [state, navigate]);

  if (state === "loading") {
    return <LoadingScreenComponent />;
  }

  return null;
}
