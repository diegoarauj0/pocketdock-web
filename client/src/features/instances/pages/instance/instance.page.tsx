import { InstanceInformationComponent } from "../../components/instanceInformation/instanceInformation.component";
import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { InstanceUsageComponent } from "../../components/instanceUsage/instanceUsage.component";
import { ArrowLeft, CircleAlert, LoaderCircle, Play, Square, Trash } from "lucide-react";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { useInstanceHandlers } from "../../hooks/useInstanceHandlers.hook";
import { INSTANCE_CONSTANT } from "../../constants/instance.constant";
import { useInstanceQuery } from "../../queries/useInstance.query.ts";
import { useStateQuery } from "../../queries/useState.query";
import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import * as S from "./instance.styled";

export function InstancePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("instances");

  const instanceQuery = useInstanceQuery(id);

  const isCompleted = instanceQuery.data?.status === INSTANCE_CONSTANT.STATUS.COMPLETED;

  const stateQuery = useStateQuery(id, isCompleted);

  const { handleDeleteInstance, handleStartInstance, handleStopInstance } = useInstanceHandlers({
    id: id ?? "",
  });

  if (instanceQuery.isPending || (isCompleted && stateQuery.isPending)) {
    return <LoadingScreenComponent />;
  }

  if (instanceQuery.isError || (isCompleted && stateQuery.isError)) {
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

  const instance = instanceQuery.data!;
  const state = stateQuery.data;

  const isContainerReady = instance.status === INSTANCE_CONSTANT.STATUS.COMPLETED;
  const isContainerPending = instance.status === INSTANCE_CONSTANT.STATUS.PENDING;
  const isRunning = state?.status === "running";

  const statusLabel = {
    pending: t("INSTANCE_STATUS_PENDING"),
    completed: isRunning ? t("INSTANCE_RUNNING_STATUS") : t("INSTANCE_STOPPED_STATUS"),
    failed: t("INSTANCE_STATUS_FAILED"),
  }[instance.status];

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
              $stop={isRunning}
              disabled={!isContainerReady}
              onClick={isRunning ? handleStopInstance : handleStartInstance}
            >
              {isRunning ? <Square /> : <Play />}
              {isRunning ? t("INSTANCE_STOP") : t("INSTANCE_START")}
            </S.StartOrStopInstance>
            <S.DeleteInstance type="button" disabled={isContainerPending} onClick={handleDeleteInstance}>
              <Trash /> {t("INSTANCE_REMOVE")}
            </S.DeleteInstance>
          </S.ButtonGroup>

          <S.Status $status={instance.status} $isRunning={isRunning}>
            {statusLabel}
          </S.Status>
        </S.InstanceHeader>

        {state !== undefined ? (
          <InstanceUsageComponent state={state} />
        ) : (
          <S.StatusNotice $status={instance.status}>
            {instance.status === INSTANCE_CONSTANT.STATUS.FAILED ? (
              <>
                <CircleAlert size={20} />
                {t("INSTANCE_FAILED_NOTICE")}
              </>
            ) : (
              <>
                <LoaderCircle size={20} />
                {t("INSTANCE_PENDING_NOTICE")}
              </>
            )}
          </S.StatusNotice>
        )}

        <InstanceInformationComponent instance={instance} />
      </S.Content>
    </S.PageWrapper>
  );
}
