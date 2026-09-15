import { type InterfaceValidationErrorDetails } from "@/shared/services/http.service";
import type { InterfaceSignInFormValues } from "../validations/signIn.validation";
import { notificationService } from "@/shared/services/notification.service";
import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { useSignInMutation } from "../mutations/useSignInMutation.hook";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { getSignInSchema } from "../validations/signIn.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import type { BaseSyntheticEvent } from "react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import { useForm } from "react-hook-form";

interface InterfaceUseSignInReturn {
  handleSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<InterfaceSignInFormValues>;
  errors: FieldErrors<InterfaceSignInFormValues>;
  isSubmitting: boolean;
}

export function useSignIn(): InterfaceUseSignInReturn {
  const signInSchema = useMemo(() => getSignInSchema(), []);
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
          notificationService.error("Email or password is invalid.");

          setError("email", { type: "server", message: "Email or password is invalid." });
          setError("password", { type: "server", message: "Email or password is invalid." });
        }

        if (error.code === ERROR_CODES.VALIDATION_ERROR) {
          const details = error.details as InterfaceValidationErrorDetails[];

          details.forEach(({ name, reasons }) => {
            setError(name as keyof InterfaceSignInFormValues, { type: "server", message: reasons[0].message });
          });
        }
      }

      notificationService.error("Unknown error.", notificationID);
    },
    [notificationID, setError],
  );

  const handleSuccess = useCallback(() => {
    notificationService.success("Welcome back! You are now signed in.", notificationID);

    navigate(APP_PATH.HOME);
  }, [notificationID, navigate]);

  const submitHandler = handleSubmit(async (values) => {
    notificationService.loading("Signing in...", notificationID);

    signInMutation.mutate(values, {
      onSuccess: handleSuccess,
      onError: handleError,
    });
  });

  return { register, errors, isSubmitting: signInMutation.isPending, handleSubmit: submitHandler };
}
