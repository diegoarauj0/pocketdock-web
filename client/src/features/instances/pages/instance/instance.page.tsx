import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { InstanceUsageComponent } from "../../components/instanceUsage/instanceUsage.component";
import { InstanceInformationComponent } from "../../components/instanceInformation/instanceInformation.component";
import { ArrowLeft, CircleAlert, Play, Square, Trash } from "lucide-react";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { useInstanceHandlers } from "../../hooks/useInstanceHandlers.hook";
import { useInstanceQuery } from "../../queries/useInstance.query";
import { useStateQuery } from "../../queries/useState.query";
import { Link, useParams } from "react-router";
import { APP_PATH } from "@/app/app.path";
import * as S from "./instance.styled";
import { useTranslation } from "react-i18next";

export function InstancePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("instances");

  const instanceQuery = useInstanceQuery(id);
  const stateQuery = useStateQuery(id);

  const { handleDeleteInstance, handleStartInstance, handleStopInstance } = useInstanceHandlers({
    stateQuery,
    id: id ?? "",
  });

  if (stateQuery.isPending || instanceQuery.isPending) {
    return <LoadingScreenComponent />;
  }

  if (stateQuery.isError || instanceQuery.isError) {
    return (
      <S.PageWrapper>
        <HeaderComponent />

        <S.Content>
          <S.ErrorState>
            <S.ErrorIcon>
              <CircleAlert size={48} />
            </S.ErrorIcon>

            <S.ErrorTitle>{t("INSTANCE_LOAD_ERROR_TITLE")}</S.ErrorTitle>
            <S.ErrorMessage>{t("INSTANCE_LOAD_ERROR_MESSAGE")}</S.ErrorMessage>

            <S.ErrorBackLink>
              <Link to={APP_PATH.INSTANCES}>
                <ArrowLeft /> {t("INSTANCE_BACK_TO_LIST")}
              </Link>
            </S.ErrorBackLink>
          </S.ErrorState>
        </S.Content>
      </S.PageWrapper>
    );
  }

  const state = stateQuery.data!;
  const instance = instanceQuery.data!;

  return (
    <S.PageWrapper>
      <HeaderComponent />

      <S.Content>
        <S.InstanceHeader>
          <S.PreviewLink>
            <Link to={APP_PATH.INSTANCES}>
              <ArrowLeft /> {t("INSTANCE_PREVIEW")}
            </Link>
          </S.PreviewLink>

          <S.TextGroup>
            <S.Title>{instance.containerName}</S.Title>
            <S.Subtitle>{instance.url}</S.Subtitle>
          </S.TextGroup>

          <S.ButtonGroup>
            <S.StartOrStopInstance
              type="button"
              $stop={state.status === "running"}
              onClick={state.status === "running" ? handleStopInstance : handleStartInstance}
            >
              {state.status === "running" ? <Square /> : <Play />}
              {state.status === "running" ? t("INSTANCE_STOP") : t("INSTANCE_START")}
            </S.StartOrStopInstance>
            <S.DeleteInstance type="button" onClick={handleDeleteInstance}>
              <Trash /> {t("INSTANCE_REMOVE")}
            </S.DeleteInstance>
          </S.ButtonGroup>

          <S.Status $isRunning={state.status === "running"}>
            {state.status === "running" ? t("INSTANCE_RUNNING_STATUS") : t("INSTANCE_STOPPED_STATUS")}
          </S.Status>
        </S.InstanceHeader>

        <InstanceUsageComponent state={state} />

        <InstanceInformationComponent instance={instance} />
      </S.Content>
    </S.PageWrapper>
  );
}
