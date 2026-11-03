import { HeaderComponent } from "@/shared/components/header/header.component";
import { APP_PATH } from "@/app/app.path";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router";
import { ArrowLeft, Container, ShieldCheck, Users } from "lucide-react";
import * as S from "./admin.styled";

export function AdminLayout() {
  const { t } = useTranslation("admin");
  const navigate = useNavigate();

  const handleBack = () => {
    const historyIndex = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      return navigate(-1);
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
            <S.SidebarEyebrow>
              <ShieldCheck size={12} />
              {t("LAYOUT_EYEBROW")}
            </S.SidebarEyebrow>
            <S.SidebarTitle>{t("LAYOUT_TITLE")}</S.SidebarTitle>
            <S.SidebarDescription>{t("LAYOUT_DESCRIPTION")}</S.SidebarDescription>
          </S.SidebarHeader>

          <S.NavList aria-label={t("LAYOUT_TITLE")}>
            <S.NavItem to={APP_PATH.ADMIN.USERS}>
              <Users size={16} />
              {t("NAV_USERS")}
            </S.NavItem>

            <S.NavItem to={APP_PATH.ADMIN.INSTANCES}>
              <Container size={16} />
              {t("NAV_INSTANCES")}
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
