import type { InterfaceCodeInputRegister } from "@/shared/hooks/useVerificationCode.hook";
import { useSignUpResendMutation } from "../mutations/useSignUpResendMutation.hook";
import { useSignUpVerifyMutation } from "../mutations/useSignUpVerifyMutation.hook";
import { useVerificationCode } from "@/shared/hooks/useVerificationCode.hook";
import { notificationService } from "@/shared/services/notification.service";
import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { useLocation, useNavigate } from "react-router";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import { useCallback, useState } from "react";
import { APP_PATH } from "@/app/app.path";
import type { SubmitEvent } from "react";

const CODE_LENGTH = AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH;

interface InterfaceEmailLocationState {
  email?: string;
}

interface InterfaceUseEmailVerificationReturn {
  getCodeInputRegister: (index: number) => InterfaceCodeInputRegister;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  handleResend: () => void;
  isSubmitting: boolean;
  isResending: boolean;
  error: string;
  email: string;
}

export function useEmailVerification(): InterfaceUseEmailVerificationReturn {
  const verifyMutation = useSignUpVerifyMutation();
  const resendMutation = useSignUpResendMutation();

  const location = useLocation();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const verificationCode = useVerificationCode({
    length: CODE_LENGTH,
  });

  const { handleSubmit, getCodeInputRegister, error: codeError, reset } = verificationCode;

  const stateEmail = (location.state as InterfaceEmailLocationState | null)?.email;
  const email = typeof stateEmail === "string" ? stateEmail.trim() : "";
  const notificationID = AUTH_CONSTANT.NOTIFICATION_IDS.EMAIL_VERIFICATION;

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiResponseError) {
        if (error.code === ERROR_CODES.INVALID_EMAIL_VERIFICATION_CODE) {
          notificationService.error("The code you entered is invalid or has expired.");

          setServerError("The code you entered is invalid or has expired.");
          reset();
        }

        if (error.code === ERROR_CODES.CONCURRENT_EMAIL_VERIFICATION) {
          notificationService.error("We already sent you a code. Please check your inbox.");
        }
      }

      notificationService.error("Unknown error.", notificationID);
    },
    [notificationID, reset],
  );

  const handleVerifySuccess = useCallback(() => {
    notificationService.success("Email verified! Your account is now active.", notificationID);

    navigate(APP_PATH.HOME);
  }, [notificationID, navigate]);

  const handleResendSuccess = useCallback(() => {
    notificationService.success("A new verification code was sent to your email.", notificationID);

    reset();
  }, [notificationID, reset]);

  const submitHandler = handleSubmit((code) => {
    setServerError("");

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
    error: codeError || serverError,
    handleSubmit: submitHandler,
    getCodeInputRegister,
    handleResend,
    email,
  };
}
