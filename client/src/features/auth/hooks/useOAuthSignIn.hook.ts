import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { notificationService } from "@/shared/services/notification.service";
import { useOAuthAuthorizeMutation } from "../mutations/useOAuthAuthorize.mutation";
import { OAUTH_CONSTANT } from "../constants/oauth.constant";
import { useCallback } from "react";

export function useOAuthSignIn() {
  const authorizeMutation = useOAuthAuthorizeMutation();

  const handleError = useCallback((error: unknown) => {
    if (error instanceof ApiResponseError) {
      if (error.code === ERROR_CODES.OAUTH_PROVIDER_ERROR) {
        notificationService.error("Google sign in is unavailable right now.");
        return;
      }

      if (error.code === ERROR_CODES.VALIDATION_ERROR) {
        notificationService.error("Invalid sign in request.");
        return;
      }
    }

    notificationService.error("Unknown error.");
  }, []);

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