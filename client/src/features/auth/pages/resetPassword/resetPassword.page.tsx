import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { CodeInputsComponent } from "@/shared/components/codeInputs/codeInputs.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { AuthFieldComponent } from "../../components/authField/authField.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { useResetPassword } from "../../hooks/useResetPassword.hook";
import { useTranslation } from "react-i18next";
import { AUTH_CONSTANT } from "../../constants/auth.constant";
import * as S from "./resetPassword.styled";
import { APP_PATH } from "@/app/app.path";

type ResetPasswordStep = "email" | "password" | "code";

const STEPS: ResetPasswordStep[] = ["email", "password", "code"];

export function ResetPasswordPage() {
  const { handlers, registrars, errors, step, values, previousStep, stats } = useResetPassword();
  const { t } = useTranslation(["auth", "common"]);

  const { isResending, isSubmitting } = stats;
  const { handleCode, handleEmail, handlePassword, handleResend, onChangeCode } = handlers;

  const headerByStep = {
    email: {
      title: t("RESET_PASSWORD_EMAIL_TITLE"),
      subtitle: t("RESET_PASSWORD_EMAIL_SUBTITLE"),
    },
    password: {
      title: t("RESET_PASSWORD_NEW_TITLE"),
      subtitle: t("RESET_PASSWORD_NEW_SUBTITLE"),
    },
    code: {
      title: t("RESET_PASSWORD_CODE_TITLE"),
      subtitle: t("RESET_PASSWORD_CODE_SUBTITLE", {
        codeLength: AUTH_CONSTANT.EMAIL_VERIFICATION_CODE_LENGTH,
        email: values.email,
      }),
    },
  };

  return (
    <S.ResetPasswordWrapper>
      <AuthIntroComponent headline={t("RESET_PASSWORD_HEADLINE")} description={t("RESET_PASSWORD_DESCRIPTION")}>
        <S.FormWrapper>
          <S.FormCard>
            <S.StepIndicator>
              {STEPS.map((item, index) => (
                <S.StepSegment key={item} $active={index <= STEPS.indexOf(step)} />
              ))}
            </S.StepIndicator>

            <FormHeaderComponent
              brand={t("BRAND_POCKETDOCK", { ns: "common" })}
              title={headerByStep[step].title}
              subtitle={headerByStep[step].subtitle}
            />

            {step === "email" && (
              <S.Form onSubmit={handleEmail}>
                <AuthFieldComponent
                  htmlFor="email"
                  label={t("EMAIL_LABEL")}
                  type="email"
                  placeholder={t("EMAIL_PLACEHOLDER")}
                  register={registrars.email}
                  error={errors.email}
                />

                <PrimaryButtonComponent type="submit">{t("RESET_PASSWORD_CONTINUE")}</PrimaryButtonComponent>
              </S.Form>
            )}

            {step === "password" && (
              <S.Form onSubmit={handlePassword}>
                <AuthFieldComponent
                  htmlFor="new-password"
                  label={t("RESET_PASSWORD_NEW_PASSWORD_LABEL")}
                  type="password"
                  placeholder={t("PASSWORD_PLACEHOLDER")}
                  register={registrars.password}
                  error={errors.password}
                />
                <AuthFieldComponent
                  htmlFor="confirm-password"
                  label={t("RESET_PASSWORD_CONFIRM_PASSWORD_LABEL")}
                  type="password"
                  placeholder={t("PASSWORD_PLACEHOLDER")}
                  register={registrars.confirmPassword}
                  error={errors.confirmPassword}
                />

                <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                  {t("RESET_PASSWORD_CONTINUE")}
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
                  {t("RESET_PASSWORD_SUBMIT")}
                </PrimaryButtonComponent>

                <S.ResendPrompt>
                  {t("RESET_PASSWORD_RESEND_PROMPT")}{" "}
                  <S.ResendButton type="button" onClick={handleResend} disabled={isResending}>
                    {t("RESET_PASSWORD_RESEND_LINK")}
                  </S.ResendButton>
                </S.ResendPrompt>
              </S.Form>
            )}

            {step !== "email" && (
              <S.BackButton type="button" onClick={previousStep}>
                {t("RESET_PASSWORD_BACK")}
              </S.BackButton>
            )}

            <AuthLinkPromptComponent
              text={t("RESET_PASSWORD_REMEMBERED")}
              linkLabel={t("RESET_PASSWORD_SIGN_IN_LINK")}
              linkTo={APP_PATH.AUTH.SIGN_IN}
            />
          </S.FormCard>
        </S.FormWrapper>
      </AuthIntroComponent>
    </S.ResetPasswordWrapper>
  );
}
