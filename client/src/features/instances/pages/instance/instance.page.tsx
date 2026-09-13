import { ApiResponseError } from "@/shared/http/http.client";
import { useDeleteInstanceMutation } from "../../mutations/useDeleteInstance.mutation";
import { useStopInstanceMutation } from "../../mutations/useStopInstance.mutation";
import { useStartInstanceMutation } from "../../mutations/useStartInstance.mutation";
import { notificationService } from "@/shared/services/notification.service";
import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { ArrowLeft, CircleAlert, Cpu, MemoryStick, Play, Square, Trash } from "lucide-react";
import { useInstanceQuery } from "../../queries/useInstance.query";
import { useStateQuery } from "../../queries/useState.query";
import { Link, useNavigate, useParams } from "react-router";
import { APP_CONSTANT } from "@/app/app.constant";
import { APP_PATH } from "@/app/app.path";
import * as S from "./instance.styled";

const formatCreatedAt = (date: string): string => {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
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
  const stopInstanceMutation = useStopInstanceMutation();
  const startInstanceMutation = useStartInstanceMutation();
  const deleteInstanceMutation = useDeleteInstanceMutation();

  const notificationID = APP_CONSTANT.NOTIFICATION_IDS.DELETE_INSTANCE;

  const handleMutationError = (error: unknown, ID: string, genericMessage: string) => {
    if (error instanceof ApiResponseError) {
      notificationService.error(error.message, ID);
      return;
    }

    notificationService.error(genericMessage, ID);
  };

  const handleStopInstance = () => {
    const notificationID = APP_CONSTANT.NOTIFICATION_IDS.STOP_INSTANCE;

    notificationService.loading("Parando instância...", notificationID);

    stopInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success("Instância parada com sucesso.", notificationID);
        stateQuery.refetch();
      },
      onError: (error) => handleMutationError(error, notificationID, "Não foi possível parar a instância."),
    });
  };

  const handleStartInstance = () => {
    const notificationID = APP_CONSTANT.NOTIFICATION_IDS.START_INSTANCE;

    notificationService.loading("Iniciando instância...", notificationID);

    startInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success("Instância iniciada com sucesso.", notificationID);
        stateQuery.refetch();
      },
      onError: (error) => handleMutationError(error, notificationID, "Não foi possível iniciar a instância."),
    });
  };

  const handleDeleteInstance = () => {
    notificationService.loading("Deletando instância...", notificationID);

    deleteInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success("Instância deletada com sucesso.", notificationID);
        navigate(APP_PATH.INSTANCES);
      },
      onError: (error) => handleMutationError(error, notificationID, "Não foi possível deletar a instância."),
    });
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

            <S.ErrorTitle>Não foi possível carregar a instância</S.ErrorTitle>
            <S.ErrorMessage>
              Algo deu errado ao buscar os dados da instância. Tente novamente mais tarde.
            </S.ErrorMessage>

            <S.ErrorBackLink>
              <Link to={APP_PATH.INSTANCES}>
                <ArrowLeft /> Voltar para instâncias
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
              <ArrowLeft /> Preview
            </Link>
          </S.PreviewLink>

          <S.TextGroup>
            <S.Title>{instance.containerName}</S.Title>
            <S.Subtitle>
              {location.protocol}//{instance.ID}.{location.host}
            </S.Subtitle>
          </S.TextGroup>

          <S.ButtonGroup>
            <S.StartOrStopInstance
              type="button"
              $stop={state.status === "running"}
              onClick={state.status === "running" ? handleStopInstance : handleStartInstance}
            >
              {state.status === "running" ? <Square /> : <Play />}
              {state.status === "running" ? "Parar" : "Iniciar"}
            </S.StartOrStopInstance>
            <S.DeleteInstance type="button" onClick={handleDeleteInstance}>
              <Trash /> Remover
            </S.DeleteInstance>
          </S.ButtonGroup>

          <S.Status $isRunning={state.status === "running"}>
            {state.status === "running" ? "• Em execução" : "• Parada"}
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
            <S.Title>Informações da instância</S.Title>
          </S.TextGroup>

          <S.InstanceRow>
            <S.FieldLabel>ID</S.FieldLabel>
            <S.FieldValue>{instance.ID}</S.FieldValue>
          </S.InstanceRow>

          <S.InstanceRow>
            <S.FieldLabel>Criado em</S.FieldLabel>
            <S.FieldValue>{formatCreatedAt(instance.createdAt)}</S.FieldValue>
          </S.InstanceRow>

          <S.InstanceRow>
            <S.FieldLabel>URL do Painel</S.FieldLabel>
            <S.FieldValue>{location.protocol}//{instance.ID}.{location.host}/_/</S.FieldValue>
          </S.InstanceRow>

          <S.InstanceRow>
            <S.FieldLabel>URL da API</S.FieldLabel>
            <S.FieldValue>{location.protocol}//{instance.ID}.{location.host}</S.FieldValue>
          </S.InstanceRow>
        </S.InstanceData>
      </S.Content>
    </S.PageWrapper>
  );
}
