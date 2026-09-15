import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { GoogleOAuthButtonComponent } from "../../components/googleOAuthButton/googleOAuthButton.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { AuthFieldComponent } from "../../components/authField/authField.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { useOAuthSignIn } from "../../hooks/useOAuthSignIn.hook";
import { useSignIn } from "../../hooks/useSignIn.hook";
import { APP_PATH } from "@/app/app.path";
import * as S from "./signIn.styled";

const features: string[] = [
  "Stop and start without losing data",
  "Individual panel for each instance",
];

export function SignInPage() {
  const { register, errors, isSubmitting, handleSubmit } = useSignIn();
  const { isRedirecting, signInWithGoogle } = useOAuthSignIn();

  return (
    <S.SignInWrapper>
      <AuthIntroComponent
        headline={`Your PocketBase servers,\nunder control.`}
        description="Create instances in seconds, stop them when you are not using them, and remove them in one click — all from a single panel."
        features={features}
      >
        <S.FormWrapper>
          <S.FormCard>
            <FormHeaderComponent
              brand="PocketDock"
              title="Sign in to your account"
              subtitle="Access your panel to manage your PocketBase instances."
            />

            <S.Form onSubmit={handleSubmit}>
              <AuthFieldComponent
                htmlFor="email"
                label="Email"
                type="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                register={register("email")}
              />
              <AuthFieldComponent
                htmlFor="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                register={register("password")}
              />

              <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                Access
              </PrimaryButtonComponent>
            </S.Form>

            <S.OAuthDivider>
              <S.OAuthDividerLine />
              or continue with
              <S.OAuthDividerLine />
            </S.OAuthDivider>

            <S.OAuthSection>
              <GoogleOAuthButtonComponent isRedirecting={isRedirecting} onClick={signInWithGoogle} />
            </S.OAuthSection>

            <AuthLinkPromptComponent
              text="Don't have an account?"
              linkLabel="Create account"
              linkTo={APP_PATH.AUTH.SIGN_UP}
            />

            <AuthLinkPromptComponent
              text="Forgot your password?"
              linkLabel="Reset it"
              linkTo={APP_PATH.AUTH.RESET_PASSWORD}
            />
          </S.FormCard>
        </S.FormWrapper>
      </AuthIntroComponent>
    </S.SignInWrapper>
  );
}
