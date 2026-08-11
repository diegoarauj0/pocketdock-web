import { APP_PATH } from "@/app/app.path";
import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { AuthFieldComponent } from "../../components/authField/authField.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { useSignUp } from "../../hooks/useSignUp.hook";
import * as S from "./signUp.styled";

const features: string[] = [
  "Deploy in seconds",
  "Manage every instance in one place",
  "Built for simple, reliable workflows",
];

export function SignUpPage() {
  const { register, errors, isSubmitting, handleSubmit } = useSignUp();

  return (
    <S.SignUpWrapper>
      <AuthIntroComponent
        headline={`Everything your\nservers need.`}
        description="Keep your PocketBase instances organized, available, and under control from one simple workspace."
        features={features}
      >
        <S.FormWrapper>
          <S.FormCard>
            <FormHeaderComponent
              brand="PocketDock"
              title="Create your account"
              subtitle="Create your workspace and start managing your PocketBase instances."
            />

            <S.Form onSubmit={handleSubmit}>
              <AuthFieldComponent
                htmlFor="username"
                label="Name"
                type="text"
                placeholder="Your name"
                error={errors.username?.message}
                register={register("username")}
              />
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
              <AuthFieldComponent
                htmlFor="confirm-password"
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                register={register("confirmPassword")}
              />

              <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                Create Account
              </PrimaryButtonComponent>
            </S.Form>

            <AuthLinkPromptComponent
              text="Already have an account?"
              linkLabel="Sign in"
              linkTo={APP_PATH.AUTH.SIGN_IN}
            />
          </S.FormCard>
        </S.FormWrapper>
      </AuthIntroComponent>
    </S.SignUpWrapper>
  );
}
