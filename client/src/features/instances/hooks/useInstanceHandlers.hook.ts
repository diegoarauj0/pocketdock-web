import { useDeleteInstanceMutation } from "../mutations/useDeleteInstance.mutation";
import { useStartInstanceMutation } from "../mutations/useStartInstance.mutation";
import { useStopInstanceMutation } from "../mutations/useStopInstance.mutation";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useNavigate } from "react-router";
import { notificationService } from "@/shared/services/notification.service";
import { INSTANCE_CONSTANT } from "../constants/instance.constant";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import type { UseQueryResult } from "@tanstack/react-query";
import type { InterfaceState } from "../services/instances.service";

interface InterfaceInstanceHandlersProps {
  stateQuery: UseQueryResult<NoInfer<InterfaceState>, Error>;
  ID: string;
}

export function useInstanceHandlers(props: InterfaceInstanceHandlersProps) {
  const { ID, stateQuery } = props;

  const navigate = useNavigate();
  const { t } = useTranslation("instances");

  const stopInstanceMutation = useStopInstanceMutation();
  const startInstanceMutation = useStartInstanceMutation();
  const deleteInstanceMutation = useDeleteInstanceMutation();

  const handleMutationError = (error: unknown, ID: string, genericMessage: string) => {
    notificationService.error(translateServerError(t, error, genericMessage), ID);
  };

  const handleStopInstance = () => {
    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.STOP_INSTANCE;

    notificationService.loading(t("NOTIFICATION_STOP_INSTANCE_LOADING"), notificationID);

    stopInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_STOP_INSTANCE_SUCCESS"), notificationID);
        stateQuery.refetch();
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_STOP_INSTANCE_ERROR")),
    });
  };

  const handleStartInstance = () => {
    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.START_INSTANCE;

    notificationService.loading(t("NOTIFICATION_START_INSTANCE_LOADING"), notificationID);

    startInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_START_INSTANCE_SUCCESS"), notificationID);
        stateQuery.refetch();
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_START_INSTANCE_ERROR")),
    });
  };

  const handleDeleteInstance = () => {
    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.DELETE_INSTANCE;

    notificationService.loading(t("NOTIFICATION_DELETE_INSTANCE_LOADING"), notificationID);

    deleteInstanceMutation.mutate(ID || "", {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_DELETE_INSTANCE_SUCCESS"), notificationID);
        navigate(APP_PATH.INSTANCES);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_DELETE_INSTANCE_ERROR")),
    });
  };

  return { handleDeleteInstance, handleStartInstance, handleStopInstance };
}
