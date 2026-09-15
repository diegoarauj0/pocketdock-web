import { useForgotPasswordVerifyMutation } from "../mutations/useForgotPasswordVerifyMutation.hook";
import { useForgotPasswordResendMutation } from "../mutations/useForgotPasswordResendMutation.hook";
import { getEmailSchema, type InterfaceEmailFormValues } from "../validations/email.validation";
import { useForgotPasswordMutation } from "../mutations/useForgotPasswordMutation.hook";
import { type InterfaceValidationErrorDetails } from "@/shared/services/http.service";
import { useVerificationCode } from "@/shared/hooks/useVerificationCode.hook";
import { notificationService } from "@/shared/services/notification.service";
import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import { useForm } from "react-hook-form";
import {
  getPasswordAndConfirmSchema,
  type InterfacePasswordAndConfirmFormValues,
} from "../validations/passwordAndConfirm.validation";

type ResetPasswordStep = "email" | "password" | "code";

export function useResetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<ResetPasswordStep>("email");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const forgotPasswordVerifyMutation = useForgotPasswordVerifyMutation();
  const forgotPasswordResendMutation = useForgotPasswordResendMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const emailForm = useForm<InterfaceEmailFormValues>({
    resolver: zodResolver(getEmailSchema()),
  });

  const passwordForm = useForm<InterfacePasswordAndConfirmFormValues>({
    resolver: zodResolver(getPasswordAndConfirmSchema()),
  });

  const verificationCode = useVerificationCode({ length: AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH });

  const notificationID = AUTH_CONSTANT.NOTIFICATION_IDS.RESET_PASSWORD;

  const handleError = useCallback(
    (error: unknown) => {
      setIsSubmitting(false);
      setIsResending(false);

      if (error instanceof ApiResponseError) {
        if (error.code === ERROR_CODES.INVALID_EMAIL_VERIFICATION_CODE) {
          notificationService.error("The code you entered is invalid or has expired.", notificationID);
          verificationCode.setError("The code you entered is invalid or has expired.");

          return verificationCode.reset();
        }

        if (error.code === ERROR_CODES.CONCURRENT_EMAIL_VERIFICATION) {
          notificationService.error("We already sent you a code. Please check your inbox.", notificationID);
        }

        if (error.code === ERROR_CODES.VALIDATION_ERROR) {
          const details = error.details as InterfaceValidationErrorDetails[];

          details.forEach(({ name, reasons }) => {
            if (name === "code") {
              setStep("code");
              notificationService.error("We already sent you a code. Please check your inbox.", notificationID);
              verificationCode.setError(reasons[0].message);
            }

            if (name === "email") {
              setStep("email");
              emailForm.setError("email", { message: reasons[0].message });
            }

            if (name === "password") {
              setStep("password");
              passwordForm.setError("password", { message: reasons[0].message });
            }
          });
        }
      }

      notificationService.error("Unknown error.", notificationID);
    },
    [emailForm, passwordForm, notificationID, verificationCode],
  );

  const handleVerifySuccess = useCallback(() => {
    setIsSubmitting(false);

    notificationService.success("Password updated! You can now sign in.", notificationID);

    navigate(APP_PATH.AUTH.SIGN_IN);
  }, [notificationID, navigate]);

  const handleResendSuccess = useCallback(() => {
    setIsResending(false);

    notificationService.success("A new reset code was sent to your email.", notificationID);

    verificationCode.reset();
  }, [notificationID, verificationCode]);

  const handleResend = useCallback(() => {
    setIsResending(true);

    notificationService.loading("Resending your reset code...", notificationID);

    const email = emailForm.getValues("email");

    forgotPasswordResendMutation.mutate({ email }, { onSuccess: handleResendSuccess, onError: handleError });
  }, [emailForm, forgotPasswordResendMutation, notificationID, handleResendSuccess, handleError]);

  const handleEmail = emailForm.handleSubmit(() => {
    if (step !== "email") return;

    setStep("password");
  });

  const handleForgotPasswordSuccess = useCallback(() => {
    setIsSubmitting(false);

    notificationService.success("We sent a reset code to your email.", notificationID);

    setStep("code");
  }, [notificationID]);

  const handlePassword = passwordForm.handleSubmit(({ password }) => {
    if (step !== "password") return;

    setIsSubmitting(true);

    notificationService.loading("Sending your reset code...", notificationID);

    const email = emailForm.getValues("email");

    forgotPasswordMutation.mutate(
      { email, password },
      { onSuccess: handleForgotPasswordSuccess, onError: handleError },
    );
  });

  const handleCode = verificationCode.handleSubmit((code) => {
    if (step !== "code") return;

    setIsSubmitting(true);

    notificationService.loading("Verifying your code...", notificationID);

    const email = emailForm.getValues("email");

    forgotPasswordVerifyMutation.mutate({ email, code }, { onSuccess: handleVerifySuccess, onError: handleError });
  });

  const previousStep = useCallback(() => {
    if (step === "code") return setStep("password");
    if (step === "password") return setStep("email");
  }, [step]);

  return {
    step,
    previousStep,
    handlers: {
      handleCode,
      handlePassword,
      handleEmail,
      handleResend,
      onChangeCode: verificationCode.handleCodeChange,
    },
    values: {
      email: emailForm.getValues("email"),
      password: passwordForm.getValues("password"),
      code: verificationCode.code,
    },
    stats: {
      isSubmitting: isSubmitting,
      isResending: isResending,
    },
    errors: {
      email: emailForm.formState.errors.email?.message,
      password: passwordForm.formState.errors.password?.message,
      confirmPassword: passwordForm.formState.errors.confirmPassword?.message,
      code: verificationCode.error,
    },
    registrars: {
      email: emailForm.register("email"),
      password: passwordForm.register("password"),
      confirmPassword: passwordForm.register("confirmPassword"),
    },
  };
}
