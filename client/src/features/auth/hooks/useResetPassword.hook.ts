import type { FormEvent, SubmitEvent } from "react";
import { ApiResponseError, type InterfaceValidationErrorDetails } from "@/shared/services/http.service";
import { useForgotPasswordVerifyMutation } from "../mutations/useForgotPasswordVerifyMutation.hook";
import { useForgotPasswordResendMutation } from "../mutations/useForgotPasswordResendMutation.hook";
import { useForgotPasswordMutation } from "../mutations/useForgotPasswordMutation.hook";
import { useVerificationCode } from "@/shared/hooks/useVerificationCode.hook";
import type { InterfaceCodeInputRegister } from "@/shared/hooks/useVerificationCode.hook";
import { notificationService } from "@/shared/services/notification.service";
import { ERROR_CODES } from "@/shared/http/http.client";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { APP_CONSTANT } from "@/app/app.constant";
import { APP_PATH } from "@/app/app.path";

const CODE_LENGTH = APP_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH;

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type ResetPasswordStep = "email" | "password" | "code";

const STEPS: ResetPasswordStep[] = ["email", "password", "code"];

interface InterfaceUseResetPasswordReturn {
  handleCodeSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  handlePasswordSubmit: (event: FormEvent<HTMLFormElement>) => void;
  getCodeInputRegister: (index: number) => InterfaceCodeInputRegister;
  handleEmailSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleResend: () => void;
  goToPreviousStep: () => void;
  setConfirmPassword: (value: string) => void;
  confirmPassword: string;
  setPassword: (value: string) => void;
  isResending: boolean;
  isSubmitting: boolean;
  setEmail: (value: string) => void;
  fieldError: string;
  password: string;
  error: string;
  email: string;
  step: ResetPasswordStep;
}

export function useResetPassword(): InterfaceUseResetPasswordReturn {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const forgotPasswordVerifyMutation = useForgotPasswordVerifyMutation();
  const forgotPasswordResendMutation = useForgotPasswordResendMutation();

  const [step, setStep] = useState<ResetPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");

  const { handleSubmit, getCodeInputRegister, error: codeError, reset } = useVerificationCode({
    length: CODE_LENGTH,
  });

  const notificationID = APP_CONSTANT.NOTIFICATION_IDS.RESET_PASSWORD;

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

        if (error.code === ERROR_CODES.VALIDATION_ERROR) {
          const details = error.details as InterfaceValidationErrorDetails[];

          details.forEach(({ name, reasons }) => {
            if (name === "code") {
              setServerError(reasons[0].message);
            }

            if (name === "email" || name === "password") {
              setFieldError(reasons[0].message);
            }
          });
        }
      }

      notificationService.error("Unknown error.", notificationID);
    },
    [notificationID, reset],
  );

  const handleForgotPasswordSuccess = useCallback(() => {
    notificationService.success("We sent a reset code to your email.", notificationID);

    setStep("code");
  }, [notificationID]);

  const handleVerifySuccess = useCallback(() => {
    notificationService.success("Password updated! You can now sign in.", notificationID);

    navigate(APP_PATH.AUTH.SIGN_IN);
  }, [notificationID, navigate]);

  const handleResendSuccess = useCallback(() => {
    notificationService.success("A new reset code was sent to your email.", notificationID);

    reset();
  }, [notificationID, reset]);

  const handleEmailSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFieldError("");

      if (!EMAIL_PATTERN.test(email.trim())) {
        setFieldError("Enter a valid email address.");
        return;
      }

      setStep("password");
    },
    [email],
  );

  const handlePasswordSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFieldError("");

      if (password.length < APP_CONSTANT.PASSWORD_MIN_LENGTH) {
        setFieldError(`Password must be at least ${APP_CONSTANT.PASSWORD_MIN_LENGTH} characters.`);
        return;
      }

      if (password !== confirmPassword) {
        setFieldError("Passwords do not match.");
        return;
      }

      notificationService.loading("Sending your reset code...", notificationID);

      forgotPasswordMutation.mutate(
        { email, password },
        { onSuccess: handleForgotPasswordSuccess, onError: handleError },
      );
    },
    [confirmPassword, email, forgotPasswordMutation, handleError, handleForgotPasswordSuccess, notificationID, password],
  );

  const codeSubmitHandler = handleSubmit((code) => {
    setServerError("");

    notificationService.loading("Verifying your code...", notificationID);

    forgotPasswordVerifyMutation.mutate(
      { email, code },
      { onSuccess: handleVerifySuccess, onError: handleError },
    );
  });

  const handleResend = useCallback(() => {
    notificationService.loading("Resending your reset code...", notificationID);

    forgotPasswordResendMutation.mutate(
      { email },
      { onSuccess: handleResendSuccess, onError: handleError },
    );
  }, [email, forgotPasswordResendMutation, handleError, handleResendSuccess, notificationID]);

  const goToPreviousStep = useCallback(() => {
    setFieldError("");
    setServerError("");
    setStep(STEPS[STEPS.indexOf(step) - 1]);
  }, [step]);

  return {
    handleCodeSubmit: codeSubmitHandler,
    handlePasswordSubmit,
    getCodeInputRegister,
    handleEmailSubmit,
    handleResend,
    goToPreviousStep,
    setConfirmPassword,
    confirmPassword,
    setPassword,
    isResending: forgotPasswordResendMutation.isPending,
    isSubmitting: forgotPasswordMutation.isPending || forgotPasswordVerifyMutation.isPending,
    setEmail,
    fieldError,
    password,
    error: codeError || serverError,
    email,
    step,
  };
}
