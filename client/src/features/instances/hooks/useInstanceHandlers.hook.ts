import { useDeleteInstanceMutation } from "../mutations/useDeleteInstance.mutation";
import { useStartInstanceMutation } from "../mutations/useStartInstance.mutation";
import { useStopInstanceMutation } from "../mutations/useStopInstance.mutation";
import { useNavigate } from "react-router";
import { ApiResponseError } from "@/shared/http/http.client";
import { notificationService } from "@/shared/services/notification.service";
import { INSTANCE_CONSTANT } from "../constants/instance.constant";
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

  return { handleDeleteInstance, handleStartInstance, handleStopInstance };
}
