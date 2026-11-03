import { useTranslation } from "react-i18next";
import * as S from "./adminLoadingState.styled";

export function AdminLoadingStateComponent() {
  const { t } = useTranslation("admin");

  return (
    <S.Wrapper role="status">
      <S.Spinner />
      {t("LOADING")}
    </S.Wrapper>
  );
}
