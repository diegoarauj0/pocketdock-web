import { EmailVerificationGuardComponent } from "@/features/auth/components/emailVerificationGuard/emailVerificationGuard.component";
import { OptionalAuthComponent } from "@/features/auth/components/optionalAuthRoute/optionalAuthRoute.component";
import { PublicOnlyRouteComponent } from "@/features/auth/components/publicOnlyRoute/publicOnlyRoute.component";
import { PrivateRouteComponent } from "@/features/auth/components/privateRoute/privateRoute.component";
import { EmailVerificationPage } from "@/features/auth/pages/emailVerification/emailVerification.page";
import { OAuthCallbackPage } from "@/features/auth/pages/oAuthCallback/oAuthCallback.page";
import { ResetPasswordPage } from "@/features/auth/pages/resetPassword/resetPassword.page";
import { InstancesPage } from "@/features/instances/pages/instances/instances.page";
import { InstancePage } from "@/features/instances/pages/instance/instance.page";
import { SignInPage } from "@/features/auth/pages/signIn/signIn.page";
import { SignUpPage } from "@/features/auth/pages/signUp/signUp.page";
import { AuthLayout } from "@/features/auth/layouts/auth.layout";
import { HomePage } from "@/features/home/pages/home/home.page";
import { Navigate, createBrowserRouter } from "react-router";
import { APP_PATH } from "./app.path";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <PublicOnlyRouteComponent />,
        children: [
          {
            path: APP_PATH.AUTH.SIGN_IN,
            element: <SignInPage />,
          },
          {
            path: APP_PATH.AUTH.SIGN_UP,
            element: <SignUpPage />,
          },
          {
            path: APP_PATH.AUTH.EMAIL_VERIFICATION,
            element: <EmailVerificationGuardComponent />,
            children: [
              {
                index: true,
                element: <EmailVerificationPage />,
              },
            ],
          },
          {
            path: APP_PATH.AUTH.RESET_PASSWORD,
            element: <ResetPasswordPage />,
          },
          {
            path: APP_PATH.AUTH.OAUTH_CALLBACK,
            element: <OAuthCallbackPage />,
          },
        ],
      },
    ],
  },

  {
    element: <OptionalAuthComponent />,
    children: [
      {
        path: APP_PATH.HOME,
        element: <HomePage />,
      },
    ],
  },

  {
    element: <PrivateRouteComponent />,
    children: [
      {
        path: APP_PATH.INSTANCES,
        element: <InstancesPage />,
      },
      {
        path: APP_PATH.INSTANCE,
        element: <InstancePage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to={APP_PATH.HOME} replace />,
  },
]);
