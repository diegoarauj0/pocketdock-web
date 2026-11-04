import type { InterfaceAdminInstance } from "../services/admin.service";
import { useDeleteInstanceMutation } from "../mutations/useDeleteInstance.mutation";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/shared/services/notification.service";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog.hook";
import { ADMIN_CONSTANT } from "../admin.constant";
import { useTranslation } from "react-i18next";

export function useAdminInstanceActions() {
  const { confirm, confirmDialog } = useConfirmDialog();
  const deleteInstanceMutation = useDeleteInstanceMutation();
  const queryClient = useQueryClient();
  const { t } = useTranslation("admin");

  const handleMutationError = (error: unknown, id: string, genericMessage: string) => {
    notificationService.error(translateServerError(t, error, genericMessage), id);
  };

  const handleDeleteInstance = async (instance: InterfaceAdminInstance) => {
    const confirmed = await confirm({
      title: t("CONFIRM_DELETE_INSTANCE_TITLE", { name: instance.containerName }),
      description: t("CONFIRM_DELETE_INSTANCE_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
      variant: "danger",
    });

    if (!confirmed) return;

    const notificationID = ADMIN_CONSTANT.NOTIFICATION_IDS.DELETE_INSTANCE;

    notificationService.loading(t("NOTIFICATION_DELETE_INSTANCE_LOADING"), notificationID);

    deleteInstanceMutation.mutate(instance.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_DELETE_INSTANCE_SUCCESS"), notificationID);
        void queryClient.invalidateQueries({ queryKey: ["admin", "instances"] });
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_DELETE_INSTANCE_ERROR")),
    });
  };

  return {
    confirmDialog,
    deletingInstanceId: deleteInstanceMutation.isPending ? deleteInstanceMutation.variables : undefined,
    handleDeleteInstance,
  };
}
