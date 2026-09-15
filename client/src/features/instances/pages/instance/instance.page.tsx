import { ApiResponseError } from "@/shared/http/http.client";
import { useDeleteInstanceMutation } from "../../mutations/useDeleteInstance.mutation";
import { useStopInstanceMutation } from "../../mutations/useStopInstance.mutation";
import { useStartInstanceMutation } from "../../mutations/useStartInstance.mutation";
import { notificationService } from "@/shared/services/notification.service";
import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { ArrowLeft, Check, CircleAlert, Copy, Cpu, MemoryStick, Play, Square, Trash } from "lucide-react";
import { useInstanceQuery } from "../../queries/useInstance.query";
import { useStateQuery } from "../../queries/useState.query";
import { Link, useNavigate, useParams } from "react-router";
import { INSTANCE_CONSTANT } from "../../constants/instance.constant";
import { APP_PATH } from "@/app/app.path";
import { useState } from "react";
import * as S from "./instance.styled";

const formatCreatedAt = (date: string): string => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(new Date(date));
};

export function InstancePage() {
  const { ID } = useParams<{ ID: string }>();
  const navigate = useNavigate();

  const instanceQuery = useInstanceQuery(ID);
  const stateQuery = useStateQuery(ID);
  const [copiedField, setCopiedField] = useState<"password" | "panel" | "api" | null>(null);
  const stopInstanceMutation = useStopInstanceMutation();
  const startInstanceMutation = useStartInstanceMutation();
  const deleteInstanceMutation = useDeleteInstanceMutation();

  const handleMutationError = (error: unknown, ID: string, genericMessage: string) => {
    if (error instanceof ApiResponseError) {
      notificationService.error(error.message, ID);
      return;
    }

    notificationService.error(genericMessage, ID);
  };

  const handleStopInstance = () => {
    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.STOP_INSTANCE;

    notificationService.loading("Stopping instance...", notificationID);

    stopInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success("Instance stopped successfully.", notificationID);
        stateQuery.refetch();
      },
      onError: (error) => handleMutationError(error, notificationID, "Could not stop the instance."),
    });
  };

  const handleStartInstance = () => {
    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.START_INSTANCE;

    notificationService.loading("Starting instance...", notificationID);

    startInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success("Instance started successfully.", notificationID);
        stateQuery.refetch();
      },
      onError: (error) => handleMutationError(error, notificationID, "Could not start the instance."),
    });
  };

  const handleDeleteInstance = () => {
    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.DELETE_INSTANCE;

    notificationService.loading("Deleting instance...", notificationID);

    deleteInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success("Instance deleted successfully.", notificationID);
        navigate(APP_PATH.INSTANCES);
      },
      onError: (error) => handleMutationError(error, notificationID, "Could not delete the instance."),
    });
  };

  const handleCopy = async (value: string, field: "password" | "panel" | "api") => {
    await navigator.clipboard.writeText(value);

    setCopiedField(field);

    setTimeout(() => setCopiedField(null), 2000);
  };

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

            <S.ErrorTitle>Could not load the instance</S.ErrorTitle>
            <S.ErrorMessage>Something went wrong while loading the instance data. Try again later.</S.ErrorMessage>

            <S.ErrorBackLink>
              <Link to={APP_PATH.INSTANCES}>
                <ArrowLeft /> Back to instances
              </Link>
            </S.ErrorBackLink>
          </S.ErrorState>
        </S.Content>
      </S.PageWrapper>
    );
  }

  const state = stateQuery.data!;
  const instance = instanceQuery.data!;

  const panelURL = `${instance.url}/_/`;

  const renderCopyButton = (field: "password" | "panel" | "api") => {
    const copied = copiedField === field;

    return (
      <S.CopyButton
        type="button"
        onClick={() =>
          handleCopy(field === "password" ? instance.defaultPassword : field === "panel" ? panelURL : instance.url, field)
        }
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </S.CopyButton>
    );
  };

  return (
    <S.PageWrapper>
      <HeaderComponent />

      <S.Content>
        <S.InstanceHeader>
          <S.PreviewLink>
            <Link to={APP_PATH.INSTANCES}>
              <ArrowLeft /> Preview
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
              {state.status === "running" ? "Stop" : "Start"}
            </S.StartOrStopInstance>
            <S.DeleteInstance type="button" onClick={handleDeleteInstance}>
              <Trash /> Remove
            </S.DeleteInstance>
          </S.ButtonGroup>

          <S.Status $isRunning={state.status === "running"}>
            {state.status === "running" ? "• Running" : "• Stopped"}
          </S.Status>
        </S.InstanceHeader>

        <S.InstanceUsage>
          <S.UsageCard>
            <S.UsageTitle>
              <Cpu />
              CPU
            </S.UsageTitle>
            <S.Usage>{state.cpu.percent.toFixed(2)}%</S.Usage>
          </S.UsageCard>

          <S.UsageCard>
            <S.UsageTitle>
              <MemoryStick />
              Memory
            </S.UsageTitle>
            <S.Usage>{state.memory.percent.toFixed(2)}%</S.Usage>
          </S.UsageCard>
        </S.InstanceUsage>

        <S.InstanceData>
          <S.TextGroup>
            <S.Title>Instance information</S.Title>
          </S.TextGroup>

          <S.InstanceRow>
            <S.FieldLabel>ID</S.FieldLabel>
            <S.FieldValue>{instance.ID}</S.FieldValue>
          </S.InstanceRow>

          <S.InstanceRow>
            <S.FieldLabel>Created at</S.FieldLabel>
            <S.FieldValue>{formatCreatedAt(instance.createdAt)}</S.FieldValue>
          </S.InstanceRow>

          <S.InstanceRow $full={true}>
            <S.FieldLabel>Panel URL</S.FieldLabel>

            <S.CopyableValue>
              <S.FieldValue>{panelURL}</S.FieldValue>
              {renderCopyButton("panel")}
            </S.CopyableValue>
          </S.InstanceRow>

          <S.InstanceRow $full={true}>
            <S.FieldLabel>API URL</S.FieldLabel>

            <S.CopyableValue>
              <S.FieldValue>{instance.url}</S.FieldValue>
              {renderCopyButton("api")}
            </S.CopyableValue>
          </S.InstanceRow>

          <S.InstanceRow $full={true}>
            <S.FieldLabel>Default password</S.FieldLabel>

            <S.CopyableValue >
              <S.FieldValue>{instance.defaultPassword}</S.FieldValue>
              {renderCopyButton("password")}
            </S.CopyableValue>
          </S.InstanceRow>

          <S.LoginNotice>
            The login email for this instance is the same one you use to sign in to PocketDock.
          </S.LoginNotice>

          <S.CredentialsNotice>
            Change this password after the first login at {panelURL}.
          </S.CredentialsNotice>
        </S.InstanceData>
      </S.Content>
    </S.PageWrapper>
  );
}
