import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { notificationService } from "@/shared/services/notification.service";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useOAuthAuthorizeMutation } from "../mutations/useOAuthAuthorize.mutation";
import { OAUTH_CONSTANT } from "../constants/oauth.constant";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useOAuthSignIn() {
  const authorizeMutation = useOAuthAuthorizeMutation();
  const { t } = useTranslation(["auth", "common"]);

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiResponseError) {
        if (error.code === ERROR_CODES.VALIDATION_ERROR) {
          notificationService.error(t("NOTIFICATION_OAUTH_INVALID_REQUEST"));
          return;
        }
      }

      notificationService.error(translateServerError(t, error));
    },
    [t],
  );

  const signInWithGoogle = useCallback(() => {
    authorizeMutation.mutate(OAUTH_CONSTANT.OAUTH_STRATEGY_ID.GOOGLE, {
      onSuccess: (response) => {
        window.location.assign(response.authorizeURL);
      },
      onError: handleError,
    });
  }, [authorizeMutation, handleError]);

  return { isRedirecting: authorizeMutation.isPending, signInWithGoogle };
}
