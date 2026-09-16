import { type InterfaceValidationErrorDetails } from "@/shared/services/http.service";
import type { InterfaceSignUpFormValues } from "../validations/signUp.validation";
import { notificationService } from "@/shared/services/notification.service";
import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { useSignUpMutation } from "../mutations/useSignUp.mutation";
import type { InterfaceSignUpRequest } from "../services/auth.service";
import { getSignUpSchema } from "../validations/signUp.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import { useCallback, useMemo } from "react";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import { useForm } from "react-hook-form";

export function useSignUp() {
  const { t } = useTranslation(["auth", "common"]);
  const signUpSchema = useMemo(() => getSignUpSchema(t), [t]);
  const signUpMutation = useSignUpMutation();
  const navigate = useNavigate();

  const form = useForm<InterfaceSignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const { register, handleSubmit, setError, formState } = form;
  const { errors } = formState;

  const notificationID = AUTH_CONSTANT.NOTIFICATION_IDS.SIGN_UP;

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiResponseError) {
        if (error.code === ERROR_CODES.VALIDATION_ERROR) {
          const details = error.details as InterfaceValidationErrorDetails[];

          details.forEach(({ name, reasons }) => {
            setError(name as keyof InterfaceSignUpFormValues, {
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

  const handleSuccess = useCallback(
    (_data: void, variables: InterfaceSignUpRequest) => {
      notificationService.success(t("NOTIFICATION_SIGN_UP_SUCCESS"), notificationID);

      navigate(APP_PATH.AUTH.EMAIL_VERIFICATION, {
        state: { email: variables.email },
      });
    },
    [notificationID, navigate, t],
  );

  const submitHandler = handleSubmit(async (values) => {
    const request: InterfaceSignUpRequest = {
      password: values.password,
      username: values.username,
      email: values.email,
    };

    notificationService.loading(t("NOTIFICATION_SIGN_UP_LOADING"), notificationID);

    signUpMutation.mutate(request, {
      onSuccess: handleSuccess,
      onError: handleError,
    });
  });

  return {
    register,
    errors,
    isSubmitting: signUpMutation.isPending,
    handleSubmit: submitHandler,
  };
}
