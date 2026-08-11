import { createBrowserRouter, Navigate } from "react-router";
import { AuthLayout } from "@/features/auth/layouts/auth.layout";
import { EmailVerificationGuardComponent } from "@/features/auth/components/emailVerificationGuard/emailVerificationGuard.component";
import { SignInPage } from "@/features/auth/pages/signIn/signIn.page";
import { SignUpPage } from "@/features/auth/pages/signUp/signUp.page";
import { EmailVerificationPage } from "@/features/auth/pages/emailVerification/emailVerification.page";
import { ResetPasswordPage } from "@/features/auth/pages/resetPassword/resetPassword.page";
import { HomePage } from "@/features/home/pages/home/home.page";
import { APP_PATH } from "./app.path";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: APP_PATH.AUTH.SIGN_IN, element: <SignInPage /> },
      { path: APP_PATH.AUTH.SIGN_UP, element: <SignUpPage /> },
      {
        path: APP_PATH.AUTH.EMAIL_VERIFICATION,
        element: <EmailVerificationGuardComponent />,
        children: [{ index: true, element: <EmailVerificationPage /> }],
      },
      { path: APP_PATH.AUTH.RESET_PASSWORD, element: <ResetPasswordPage /> },
      { path: "*", element: <Navigate to={APP_PATH.AUTH.SIGN_IN} replace /> },
    ],
  },
  { path: APP_PATH.HOME, element: <HomePage /> },
]);
