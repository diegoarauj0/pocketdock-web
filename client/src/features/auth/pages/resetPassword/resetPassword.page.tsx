import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { CodeInputsComponent } from "@/shared/components/codeInputs/codeInputs.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { AuthFieldComponent } from "../../components/authField/authField.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { useResetPassword } from "../../hooks/useResetPassword.hook";
import { AUTH_CONSTANT } from "../../constants/auth.constant";
import * as S from "./resetPassword.styled";
import { APP_PATH } from "@/app/app.path";

type ResetPasswordStep = "email" | "password" | "code";

const STEPS: ResetPasswordStep[] = ["email", "password", "code"];

export function ResetPasswordPage() {
  const { handlers, registrars, errors, step, values, previousStep, stats } = useResetPassword();

  const { isResending, isSubmitting } = stats;
  const { handleCode, handleEmail, handlePassword, handleResend, onChangeCode } = handlers;

  const headerByStep = {
    email: {
      title: "Reset your password",
      subtitle: "Enter the email linked to your account and we will help you recover access.",
    },
    password: {
      title: "Set a new password",
      subtitle: "Choose a strong password that you have not used before for your account.",
    },
    code: {
      title: "Verify your email",
      subtitle: `We sent a ${AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH}-character code to ${values.email}. Enter it below to confirm it is really you.`,
    },
  } as const;

  return (
    <S.ResetPasswordWrapper>
      <AuthIntroComponent
        headline={`Recover your\naccount access.`}
        description="Keep your PocketBase instances organized, available, and under control from one simple workspace."
      >
        <S.FormWrapper>
          <S.FormCard>
            <S.StepIndicator>
              {STEPS.map((item, index) => (
                <S.StepSegment key={item} $active={index <= STEPS.indexOf(step)} />
              ))}
            </S.StepIndicator>

            <FormHeaderComponent
              brand="PocketDock"
              title={headerByStep[step].title}
              subtitle={headerByStep[step].subtitle}
            />

            {step === "email" && (
              <S.Form onSubmit={handleEmail}>
                <AuthFieldComponent
                  htmlFor="email"
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  register={registrars.email}
                  error={errors.email}
                />

                <PrimaryButtonComponent type="submit">Continue</PrimaryButtonComponent>
              </S.Form>
            )}

            {step === "password" && (
              <S.Form onSubmit={handlePassword}>
                <AuthFieldComponent
                  htmlFor="new-password"
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  register={registrars.password}
                  error={errors.password}
                />
                <AuthFieldComponent
                  htmlFor="confirm-password"
                  label="Confirm new password"
                  type="password"
                  placeholder="••••••••"
                  register={registrars.confirmPassword}
                  error={errors.confirmPassword}
                />

                <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                  Continue
                </PrimaryButtonComponent>
              </S.Form>
            )}

            {step === "code" && (
              <S.Form onSubmit={handleCode}>
                <CodeInputsComponent
                  length={AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH}
                  value={values.code}
                  onChange={onChangeCode}
                />

               {errors.code && <S.ErrorMessage role="alert">{errors.code}</S.ErrorMessage>}

                <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                  Reset password
                </PrimaryButtonComponent>

                <S.ResendPrompt>
                  Didn't receive the code?{" "}
                  <S.ResendButton type="button" onClick={handleResend} disabled={isResending}>
                    Resend code
                  </S.ResendButton>
                </S.ResendPrompt>
              </S.Form>
            )}

            {step !== "email" && (
              <S.BackButton type="button" onClick={previousStep}>
                Back
              </S.BackButton>
            )}

            <AuthLinkPromptComponent
              text="Remembered your password?"
              linkLabel="Sign in"
              linkTo={APP_PATH.AUTH.SIGN_IN}
            />
          </S.FormCard>
        </S.FormWrapper>
      </AuthIntroComponent>
    </S.ResetPasswordWrapper>
  );
}
