import { APP_PATH } from "@/app/app.path";
import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { AuthFieldComponent } from "../../components/authField/authField.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { useTranslation } from "react-i18next";
import { useSignUp } from "../../hooks/useSignUp.hook";
import * as S from "./signUp.styled";

export function SignUpPage() {
  const { register, errors, isSubmitting, handleSubmit } = useSignUp();
  const { t } = useTranslation(["auth", "common"]);

  const features: string[] = [
    t("SIGN_UP_FEATURE_DEPLOY_SECONDS"),
    t("SIGN_UP_FEATURE_MANAGE_PLACE"),
    t("SIGN_UP_FEATURE_RELIABLE"),
  ];

  return (
    <S.SignUpWrapper>
      <AuthIntroComponent headline={t("SIGN_UP_HEADLINE")} description={t("SIGN_UP_DESCRIPTION")} features={features}>
        <S.FormWrapper>
          <S.FormCard>
            <FormHeaderComponent
              brand={t("BRAND_POCKETDOCK", { ns: "common" })}
              title={t("SIGN_UP_TITLE")}
              subtitle={t("SIGN_UP_SUBTITLE")}
            />

            <S.Form onSubmit={handleSubmit}>
              <AuthFieldComponent
                htmlFor="username"
                label={t("SIGN_UP_NAME_LABEL")}
                type="text"
                placeholder={t("SIGN_UP_NAME_PLACEHOLDER")}
                error={errors.username?.message}
                register={register("username")}
              />
              <AuthFieldComponent
                htmlFor="email"
                label={t("EMAIL_LABEL")}
                type="email"
                placeholder={t("EMAIL_PLACEHOLDER")}
                error={errors.email?.message}
                register={register("email")}
              />
              <AuthFieldComponent
                htmlFor="password"
                label={t("PASSWORD_LABEL")}
                type="password"
                placeholder={t("PASSWORD_PLACEHOLDER")}
                error={errors.password?.message}
                register={register("password")}
              />
              <AuthFieldComponent
                htmlFor="confirm-password"
                label={t("SIGN_UP_CONFIRM_PASSWORD_LABEL")}
                type="password"
                placeholder={t("PASSWORD_PLACEHOLDER")}
                error={errors.confirmPassword?.message}
                register={register("confirmPassword")}
              />

              <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                {t("SIGN_UP_SUBMIT")}
              </PrimaryButtonComponent>
            </S.Form>

            <AuthLinkPromptComponent
              text={t("SIGN_UP_HAS_ACCOUNT")}
              linkLabel={t("SIGN_UP_SIGN_IN_LINK")}
              linkTo={APP_PATH.AUTH.SIGN_IN}
            />
          </S.FormCard>
        </S.FormWrapper>
      </AuthIntroComponent>
    </S.SignUpWrapper>
  );
}
