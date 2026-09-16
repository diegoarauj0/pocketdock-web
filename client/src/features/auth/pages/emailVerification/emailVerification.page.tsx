import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { CodeInputsComponent } from "@/shared/components/codeInputs/codeInputs.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { useEmailVerification } from "../../hooks/useEmailVerification.hook";
import { useTranslation } from "react-i18next";
import { AUTH_CONSTANT } from "../../constants/auth.constant";
import * as S from "./emailVerification.styled";
import { APP_PATH } from "@/app/app.path";

const CODE_LENGTH = AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH;

export function EmailVerificationPage() {
  const emailVerification = useEmailVerification();
  const { t } = useTranslation(["auth", "common"]);

  const { email, error, handleResend, handleSubmit, isResending, isSubmitting } = emailVerification;

  return (
    <S.EmailVerificationWrapper>
      <AuthIntroComponent headline={t("EMAIL_VERIFICATION_HEADLINE")} description={t("EMAIL_VERIFICATION_DESCRIPTION")}>
        <S.FormWrapper>
          <S.FormCard>
            <FormHeaderComponent
              brand={t("BRAND_POCKETDOCK", { ns: "common" })}
              title={t("EMAIL_VERIFICATION_TITLE")}
              subtitle={t("EMAIL_VERIFICATION_SUBTITLE", {
                codeLength: CODE_LENGTH,
                email,
              })}
            />

            <S.Form onSubmit={handleSubmit}>
              <CodeInputsComponent
                length={CODE_LENGTH}
                value={emailVerification.code}
                onChange={emailVerification.handleCodeChange}
              />

              {error && <S.ErrorMessage role="alert">{error}</S.ErrorMessage>}

              <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                {t("EMAIL_VERIFICATION_SUBMIT")}
              </PrimaryButtonComponent>
            </S.Form>

            <S.ResendPrompt>
              {t("EMAIL_VERIFICATION_RESEND_PROMPT")}{" "}
              <S.ResendButton type="button" onClick={handleResend} disabled={isResending}>
                {t("EMAIL_VERIFICATION_RESEND_LINK")}
              </S.ResendButton>
            </S.ResendPrompt>

            <AuthLinkPromptComponent
              text={t("EMAIL_VERIFICATION_BACK_TO")}
              linkLabel={t("EMAIL_VERIFICATION_SIGN_IN_LINK")}
              linkTo={APP_PATH.AUTH.SIGN_IN}
            />
          </S.FormCard>
        </S.FormWrapper>
      </AuthIntroComponent>
    </S.EmailVerificationWrapper>
  );
}
