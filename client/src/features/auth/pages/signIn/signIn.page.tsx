import { PrimaryButtonComponent } from "@/shared/components/primaryButton/primaryButton.component";
import { AuthLinkPromptComponent } from "../../components/authLinkPrompt/authLinkPrompt.component";
import { GoogleOAuthButtonComponent } from "../../components/googleOAuthButton/googleOAuthButton.component";
import { FormHeaderComponent } from "../../components/formHeader/formHeader.component";
import { AuthFieldComponent } from "../../components/authField/authField.component";
import { AuthIntroComponent } from "../../components/authIntro/authIntro.component";
import { useOAuthSignIn } from "../../hooks/useOAuthSignIn.hook";
import { useTranslation } from "react-i18next";
import { useSignIn } from "../../hooks/useSignIn.hook";
import { APP_PATH } from "@/app/app.path";
import * as S from "./signIn.styled";

export function SignInPage() {
  const { register, errors, isSubmitting, handleSubmit } = useSignIn();
  const { isRedirecting, signInWithGoogle } = useOAuthSignIn();
  const { t } = useTranslation(["auth", "common"]);

  const features: string[] = [t("SIGN_IN_FEATURE_STOP_START"), t("SIGN_IN_FEATURE_INDIVIDUAL_PANEL")];

  return (
    <S.SignInWrapper>
      <AuthIntroComponent headline={t("SIGN_IN_HEADLINE")} description={t("SIGN_IN_DESCRIPTION")} features={features}>
        <S.FormWrapper>
          <S.FormCard>
            <FormHeaderComponent
              brand={t("BRAND_POCKETDOCK", { ns: "common" })}
              title={t("SIGN_IN_TITLE")}
              subtitle={t("SIGN_IN_SUBTITLE")}
            />

            <S.Form onSubmit={handleSubmit}>
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

              <PrimaryButtonComponent type="submit" disabled={isSubmitting}>
                {t("SIGN_IN_SUBMIT")}
              </PrimaryButtonComponent>
            </S.Form>

            <S.OAuthDivider>
              <S.OAuthDividerLine />
              {t("SIGN_IN_OAUTH_DIVIDER")}
              <S.OAuthDividerLine />
            </S.OAuthDivider>

            <S.OAuthSection>
              <GoogleOAuthButtonComponent isRedirecting={isRedirecting} onClick={signInWithGoogle} />
            </S.OAuthSection>

            <AuthLinkPromptComponent
              text={t("SIGN_IN_NO_ACCOUNT")}
              linkLabel={t("SIGN_IN_CREATE_ACCOUNT_LINK")}
              linkTo={APP_PATH.AUTH.SIGN_UP}
            />

            <AuthLinkPromptComponent
              text={t("SIGN_IN_FORGOT_PASSWORD")}
              linkLabel={t("SIGN_IN_RESET_LINK")}
              linkTo={APP_PATH.AUTH.RESET_PASSWORD}
            />
          </S.FormCard>
        </S.FormWrapper>
      </AuthIntroComponent>
    </S.SignInWrapper>
  );
}
