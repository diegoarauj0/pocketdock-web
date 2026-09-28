import { type InterfaceValidationErrorDetails } from "@/shared/services/http.service";
import type { InterfaceSignInFormValues } from "../validations/signIn.validation";
import { notificationService } from "@/shared/services/notification.service";
import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { useSignInMutation } from "../mutations/useSignIn.mutation";
import { getSignInSchema } from "../validations/signIn.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import { useCallback, useMemo } from "react";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import { useForm } from "react-hook-form";

export function useSignIn() {
  const { t } = useTranslation(["auth", "common"]);
  const signInSchema = useMemo(() => getSignInSchema(t), [t]);
  const signInMutation = useSignInMutation();
  const navigate = useNavigate();

  const form = useForm<InterfaceSignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const { register, handleSubmit, setError, formState } = form;
  const { errors } = formState;

  const notificationID = AUTH_CONSTANT.NOTIFICATION_IDS.SIGN_IN;

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiResponseError) {
        if (error.code === ERROR_CODES.INVALID_CREDENTIAL) {
          const invalidCredentialsMessage = translateServerError(t, error);

          notificationService.error(invalidCredentialsMessage, notificationID);

          setError("email", {
            type: "server",
            message: invalidCredentialsMessage,
          });

          setError("password", {
            type: "server",
            message: invalidCredentialsMessage,
          });

          return;
        }

        if (error.code === ERROR_CODES.VALIDATION_ERROR) {
          const details = error.details as InterfaceValidationErrorDetails[];

          details.forEach(({ name, reasons }) => {
            setError(name as keyof InterfaceSignInFormValues, {
              type: "server",
              message: reasons[0].message,
            });
          });
        }
      }

      notificationService.error(translateServerError(t, error), notificationID);
    },
    [notificationID, setError, t],
  );

  const handleSuccess = useCallback(() => {
    notificationService.success(t("NOTIFICATION_SIGN_IN_SUCCESS"), notificationID);

    navigate(APP_PATH.HOME);
  }, [notificationID, navigate, t]);

  const submitHandler = handleSubmit(async (values) => {
    notificationService.loading(t("NOTIFICATION_SIGN_IN_LOADING"), notificationID);

    signInMutation.mutate(values, {
      onSuccess: handleSuccess,
      onError: handleError,
    });
  });

  return {
    register,
    errors,
    isSubmitting: signInMutation.isPending,
    handleSubmit: submitHandler,
  };
}
