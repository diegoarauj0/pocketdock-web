import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { CodeInputsComponent } from "@/shared/components/codeInputs/codeInputs.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { AuthFieldComponent } from "../../components/authField/authField.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { useResetPassword } from "../../hooks/useResetPassword.hook";
import { APP_CONSTANT } from "@/app/app.constant";
import * as S from "./resetPassword.styled";
import { APP_PATH } from "@/app/app.path";

const CODE_LENGTH = APP_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH;

type ResetPasswordStep = "email" | "password" | "code";

const STEPS: ResetPasswordStep[] = ["email", "password", "code"];

export function ResetPasswordPage() {
  const {
    handleCodeSubmit,
    handlePasswordSubmit,
    getCodeInputRegister,
    handleEmailSubmit,
    handleResend,
    goToPreviousStep,
    setConfirmPassword,
    confirmPassword,
    setPassword,
    isResending,
    isSubmitting,
    setEmail,
    fieldError,
    password,
    error,
    email,
    step,
  } = useResetPassword();

  const currentStepIndex = STEPS.indexOf(step);

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
      subtitle: `We sent a ${CODE_LENGTH}-character code to ${email}. Enter it below to confirm it is really you.`,
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
                <S.StepSegment key={item} $active={index <= currentStepIndex} />
              ))}
            </S.StepIndicator>

            <FormHeaderComponent
              brand="PocketDock"
              title={headerByStep[step].title}
              subtitle={headerByStep[step].subtitle}
            />

            {step === "email" && (
              <S.Form onSubmit={handleEmailSubmit}>
                <AuthFieldComponent
                  htmlFor="email"
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                {fieldError && <S.ErrorMessage role="alert">{fieldError}</S.ErrorMessage>}

                <PrimaryButtonComponent type="submit">Continue</PrimaryButtonComponent>
              </S.Form>
            )}

            {step === "password" && (
              <S.Form onSubmit={handlePasswordSubmit}>
                <AuthFieldComponent
                  htmlFor="new-password"
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <AuthFieldComponent
                  htmlFor="confirm-password"
                  label="Confirm new password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />

                {fieldError && <S.ErrorMessage role="alert">{fieldError}</S.ErrorMessage>}

                <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                  Continue
                </PrimaryButtonComponent>
              </S.Form>
            )}

            {step === "code" && (
              <>
                <S.Form onSubmit={handleCodeSubmit}>
                  <CodeInputsComponent length={CODE_LENGTH} getCodeInputRegister={getCodeInputRegister} />

                  {error && <S.ErrorMessage role="alert">{error}</S.ErrorMessage>}

                  <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                    Reset password
                  </PrimaryButtonComponent>
                </S.Form>

                <S.ResendPrompt>
                  Didn't receive the code?{" "}
                  <S.ResendButton type="button" onClick={handleResend} disabled={isResending}>
                    Resend code
                  </S.ResendButton>
                </S.ResendPrompt>
              </>
            )}

            {currentStepIndex > 0 && (
              <S.BackButton type="button" onClick={goToPreviousStep}>
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
