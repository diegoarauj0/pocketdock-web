import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { CodeInputsComponent } from "@/shared/components/codeInputs/codeInputs.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { useEmailVerification } from "../../hooks/useEmailVerification.hook";
import { AUTH_CONSTANT } from "../../constants/auth.constant";
import * as S from "./emailVerification.styled";
import { APP_PATH } from "@/app/app.path";

const CODE_LENGTH = AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH;

export function EmailVerificationPage() {
  const emailVerification = useEmailVerification();

  const { email, error, handleResend, handleSubmit, isResending, isSubmitting } = emailVerification;

  return (
    <S.EmailVerificationWrapper>
      <AuthIntroComponent
        headline={`Confirm your\nemail address.`}
        description="Keep your PocketBase instances organized, available, and under control from one simple workspace."
      >
        <S.FormWrapper>
          <S.FormCard>
            <FormHeaderComponent
              brand="PocketDock"
              title="Verify your email"
              subtitle={`We sent a ${CODE_LENGTH}-character code to ${email}. Enter it below to confirm your account.`}
            />

            <S.Form onSubmit={handleSubmit}>
              <CodeInputsComponent length={CODE_LENGTH} getCodeInputRegister={emailVerification.getCodeInputRegister} />

              {error && <S.ErrorMessage role="alert">{error}</S.ErrorMessage>}

              <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                Verify email
              </PrimaryButtonComponent>
            </S.Form>

            <S.ResendPrompt>
              Didn't receive the code?{" "}
              <S.ResendButton type="button" onClick={handleResend} disabled={isResending}>
                Resend code
              </S.ResendButton>
            </S.ResendPrompt>

            <AuthLinkPromptComponent text="Back to" linkLabel="sign in" linkTo={APP_PATH.AUTH.SIGN_IN} />
          </S.FormCard>
        </S.FormWrapper>
      </AuthIntroComponent>
    </S.EmailVerificationWrapper>
  );
}
