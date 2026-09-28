import { useSignUpResendMutation } from "../mutations/useSignUpResend.mutation";
import { useSignUpVerifyMutation } from "../mutations/useSignUpVerify.mutation";
import { useVerificationCode } from "@/shared/hooks/useVerificationCode.hook";
import { notificationService } from "@/shared/services/notification.service";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/auth.context";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";

const CODE_LENGTH = AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH;

interface InterfaceEmailLocationState {
  email?: string;
}

export function useEmailVerification() {
  const { signIn } = useAuth();
  const { t } = useTranslation(["auth", "common"]);

  const verifyMutation = useSignUpVerifyMutation();
  const resendMutation = useSignUpResendMutation();

  const location = useLocation();
  const navigate = useNavigate();

  const verificationCode = useVerificationCode({
    length: CODE_LENGTH,
  });

  const { handleSubmit, handleCodeChange, error, reset, code } = verificationCode;

  const stateEmail = (location.state as InterfaceEmailLocationState | null)?.email;
  const email = typeof stateEmail === "string" ? stateEmail.trim() : "";
  const notificationID = AUTH_CONSTANT.NOTIFICATION_IDS.EMAIL_VERIFICATION;

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiResponseError) {
        if (error.code === ERROR_CODES.INVALID_EMAIL_VERIFICATION_CODE) {
          const invalidCodeMessage = translateServerError(t, error);

          notificationService.error(invalidCodeMessage);

          reset();
          verificationCode.setError(invalidCodeMessage);

          return;
        }

        if (error.code === ERROR_CODES.CONCURRENT_EMAIL_VERIFICATION) {
          notificationService.error(translateServerError(t, error));

          return;
        }
      }

      notificationService.error(translateServerError(t, error), notificationID);
    },
    [notificationID, reset, verificationCode, t],
  );

  const handleVerifySuccess = useCallback(
    ({ access }: { access: string }) => {
      notificationService.success(t("NOTIFICATION_EMAIL_VERIFIED"), notificationID);

      signIn(access);

      navigate(APP_PATH.HOME);
    },
    [notificationID, navigate, signIn, t],
  );

  const handleResendSuccess = useCallback(() => {
    notificationService.success(t("NOTIFICATION_VERIFICATION_CODE_SENT"), notificationID);

    reset();
  }, [notificationID, reset, t]);

  const submitHandler = handleSubmit((code) => {
    notificationService.loading(t("NOTIFICATION_EMAIL_VERIFYING"), notificationID);

    verifyMutation.mutate({ email, code }, { onSuccess: handleVerifySuccess, onError: handleError });
  });

  const handleResend = useCallback(() => {
    notificationService.loading(t("NOTIFICATION_VERIFICATION_CODE_RESENDING"), notificationID);

    resendMutation.mutate({ email }, { onSuccess: handleResendSuccess, onError: handleError });
  }, [email, handleError, handleResendSuccess, notificationID, resendMutation, t]);

  return {
    isSubmitting: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    error,
    handleSubmit: submitHandler,
    handleCodeChange,
    handleResend,
    code,
    email,
  };
}
