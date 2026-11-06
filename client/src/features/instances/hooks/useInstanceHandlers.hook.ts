import { useDeleteInstanceMutation } from "../mutations/useDeleteInstance.mutation";
import { useStartInstanceMutation } from "../mutations/useStartInstance.mutation";
import { useStopInstanceMutation } from "../mutations/useStopInstance.mutation";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useNavigate } from "react-router";
import { notificationService } from "@/shared/services/notification.service";
import { INSTANCE_CONSTANT } from "../constants/instance.constant";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog.hook";

interface InterfaceInstanceHandlersProps {
  id: string;
}

export function useInstanceHandlers(props: InterfaceInstanceHandlersProps) {
  const { id } = props;

  const navigate = useNavigate();
  const { t } = useTranslation("instances");

  const { confirm, confirmDialog } = useConfirmDialog();

  const stopInstanceMutation = useStopInstanceMutation();
  const startInstanceMutation = useStartInstanceMutation();
  const deleteInstanceMutation = useDeleteInstanceMutation();

  const handleMutationError = (error: unknown, id: string, genericMessage: string) => {
    notificationService.error(translateServerError(t, error, genericMessage), id);
  };

  const handleStopInstance = () => {
    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.STOP_INSTANCE;

    notificationService.loading(t("NOTIFICATION_STOP_INSTANCE_LOADING"), notificationID);

    stopInstanceMutation.mutate(id || "", {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_STOP_INSTANCE_SUCCESS"), notificationID);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_STOP_INSTANCE_ERROR")),
    });
  };

  const handleStartInstance = () => {
    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.START_INSTANCE;

    notificationService.loading(t("NOTIFICATION_START_INSTANCE_LOADING"), notificationID);

    startInstanceMutation.mutate(id || "", {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_START_INSTANCE_SUCCESS"), notificationID);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_START_INSTANCE_ERROR")),
    });
  };

  const handleDeleteInstance = async () => {
    const confirmed = await confirm({
      title: t("CONFIRM_DELETE_INSTANCE_TITLE"),
      description: t("CONFIRM_DELETE_INSTANCE_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
      variant: "danger",
    });

    if (!confirmed) return;

    const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.DELETE_INSTANCE;

    notificationService.loading(t("NOTIFICATION_DELETE_INSTANCE_LOADING"), notificationID);

    deleteInstanceMutation.mutate(id || "", {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_DELETE_INSTANCE_SUCCESS"), notificationID);
        navigate(APP_PATH.INSTANCES);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_DELETE_INSTANCE_ERROR")),
    });
  };

  return { handleDeleteInstance, handleStartInstance, handleStopInstance, confirmDialog };
}
