import { type InterfaceValidationErrorDetails } from "@/shared/services/http.service";
import type { InterfaceSignUpFormValues } from "../validations/signUp.validation";
import type { InterfaceSignInFormValues } from "../validations/signIn.validation";
import { notificationService } from "@/shared/services/notification.service";
import { ApiResponseError, ERROR_CODES } from "@/shared/http/http.client";
import { useSignUpMutation } from "../mutations/useSignUp.mutation";
import type { InterfaceSignUpRequest } from "../services/auth.service";
import { getSignUpSchema } from "../validations/signUp.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUTH_CONSTANT } from "../constants/auth.constant";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { APP_PATH } from "@/app/app.path";
import { useForm } from "react-hook-form";

export function useSignUp() {
  const signUpSchema = useMemo(() => getSignUpSchema(), []);
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
            setError(name as keyof InterfaceSignInFormValues, { type: "server", message: reasons[0].message });
          });
        }
      }

      notificationService.error("Unknown error.", notificationID);
    },
    [notificationID, setError],
  );

  const handleSuccess = useCallback(
    (_data: void, variables: InterfaceSignUpRequest) => {
      notificationService.success("Account created! Check your email to verify your account.", notificationID);

      navigate(APP_PATH.AUTH.EMAIL_VERIFICATION, { state: { email: variables.email } });
    },
    [notificationID, navigate],
  );

  const submitHandler = handleSubmit(async (values) => {
    const request: InterfaceSignUpRequest = {
      password: values.password,
      username: values.username,
      email: values.email,
    };

    notificationService.loading("Creating your account...", notificationID);

    signUpMutation.mutate(request, {
      onSuccess: handleSuccess,
      onError: handleError,
    });
  });

  return { register, errors, isSubmitting: signUpMutation.isPending, handleSubmit: submitHandler };
}
