import { HeaderComponent } from "@/shared/components/header/header.component";
import { Outlet, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import { ArrowLeft, Monitor } from "lucide-react";
import * as S from "./settings.styled";

export function SettingsLayout() {
  const { t } = useTranslation("settings");
  const navigate = useNavigate();

  const handleBack = () => {
    const historyIndex = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(APP_PATH.HOME);
  };

  return (
    <S.PageWrapper>
      <HeaderComponent />

      <S.BackBar>
        <S.BackButton type="button" onClick={handleBack}>
          <ArrowLeft size={16} />
          {t("BACK")}
        </S.BackButton>
      </S.BackBar>

      <S.Layout>
        <S.Sidebar>
          <S.SidebarHeader>
            <S.SidebarTitle>{t("TITLE")}</S.SidebarTitle>
            <S.SidebarDescription>{t("DESCRIPTION")}</S.SidebarDescription>
          </S.SidebarHeader>

          <S.NavList aria-label={t("TITLE")}>
            <S.NavItem to={APP_PATH.SETTINGS.INTERFACE}>
              <Monitor size={16} />
              {t("NAV_INTERFACE")}
            </S.NavItem>
          </S.NavList>
        </S.Sidebar>

        <S.Content>
          <Outlet />
        </S.Content>
      </S.Layout>
    </S.PageWrapper>
  );
}
