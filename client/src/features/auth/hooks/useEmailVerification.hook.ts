import { useSignUpResendMutation } from "../mutations/useSignUpResendMutation.hook";
import { useSignUpVerifyMutation } from "../mutations/useSignUpVerifyMutation.hook";
import { useVerificationCode } from "@/shared/hooks/useVerificationCode.hook";
import { notificationService } from "@/shared/services/notification.service";
import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { useLocation, useNavigate } from "react-router";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import { useCallback } from "react";
import { APP_PATH } from "@/app/app.path";
import type { SubmitEvent } from "react";
import { useAuth } from "../contexts/auth.context";

const CODE_LENGTH = AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH;

interface InterfaceEmailLocationState {
  email?: string;
}

interface InterfaceUseEmailVerificationReturn {
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  handleResend: () => void;
  handleCodeChange: (nextCode: string) => void;
  isSubmitting: boolean;
  isResending: boolean;
  error: string | undefined;
  code: string;
  email: string;
}

export function useEmailVerification(): InterfaceUseEmailVerificationReturn {
  const { signIn } = useAuth();

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
          notificationService.error("The code you entered is invalid or has expired.");

          reset();
          verificationCode.setError("The code you entered is invalid or has expired.");
        }

        if (error.code === ERROR_CODES.CONCURRENT_EMAIL_VERIFICATION) {
          notificationService.error("We already sent you a code. Please check your inbox.");
        }
      }

      notificationService.error("Unknown error.", notificationID);
    },
    [notificationID, reset, verificationCode],
  );

  const handleVerifySuccess = useCallback(
    ({ access }: { access: string }) => {
      notificationService.success("Email verified!.", notificationID);

      signIn(access);

      navigate(APP_PATH.HOME);
    },
    [notificationID, navigate, signIn],
  );

  const handleResendSuccess = useCallback(() => {
    notificationService.success("A new verification code was sent to your email.", notificationID);

    reset();
  }, [notificationID, reset]);

  const submitHandler = handleSubmit((code) => {
    notificationService.loading("Verifying your email...", notificationID);

    verifyMutation.mutate({ email, code }, { onSuccess: handleVerifySuccess, onError: handleError });
  });

  const handleResend = useCallback(() => {
    notificationService.loading("Resending your verification code...", notificationID);

    resendMutation.mutate({ email }, { onSuccess: handleResendSuccess, onError: handleError });
  }, [email, handleError, handleResendSuccess, notificationID, resendMutation]);

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
