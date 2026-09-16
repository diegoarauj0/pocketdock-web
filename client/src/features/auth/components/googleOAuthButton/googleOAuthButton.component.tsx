import * as S from "./googleOAuthButton.styled";
import { useTranslation } from "react-i18next";

interface InterfaceGoogleOAuthButtonProps {
  isRedirecting: boolean;
  onClick: () => void;
}

export function GoogleOAuthButtonComponent({ isRedirecting, onClick }: InterfaceGoogleOAuthButtonProps) {
  const { t } = useTranslation("auth");

  return (
    <S.Button type="button" disabled={isRedirecting} onClick={onClick}>
      <S.GoogleIcon aria-hidden="true">
        <path
          d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.507h3.232c1.891-1.741 2.982-4.305 2.982-7.348z"
          fill="#4285F4"
        />
        <path
          d="M12 22c2.7 0 4.964-.895 6.618-2.425l-3.232-2.507c-.895.6-2.041.955-3.386.955-2.605 0-4.81-1.76-5.596-4.123H3.064v2.589A9.996 9.996 0 0 0 12 22z"
          fill="#34A853"
        />
        <path
          d="M6.404 13.9a6.013 6.013 0 0 1 0-3.8V7.511H3.064a10.002 10.002 0 0 0 0 8.978l3.34-2.589z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.959 2.99 14.695 2 12 2a9.996 9.996 0 0 0-8.936 5.511l3.34 2.589C7.19 7.737 9.395 5.977 12 5.977z"
          fill="#EA4335"
        />
      </S.GoogleIcon>
      {t("GOOGLE_SIGN_IN")}
    </S.Button>
  );
}
