import type { InterfaceAdminUser } from "../services/admin.service";
import { useDemoteUserMutation } from "../mutations/useDemoteUser.mutation";
import { usePromoteUserMutation } from "../mutations/usePromoteUser.mutation";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { notificationService } from "@/shared/services/notification.service";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog.hook";
import { ADMIN_CONSTANT } from "../admin.constant";
import { useTranslation } from "react-i18next";
import type { UseQueryResult } from "@tanstack/react-query";

interface InterfaceAdminUserRoleHandlersProps {
  userQuery: UseQueryResult<NoInfer<InterfaceAdminUser>, Error>;
}

export function useAdminUserRoleHandlers({ userQuery }: InterfaceAdminUserRoleHandlersProps) {
  const { confirm, confirmDialog } = useConfirmDialog();
  const promoteUserMutation = usePromoteUserMutation();
  const demoteUserMutation = useDemoteUserMutation();
  const { t } = useTranslation("admin");

  const isRolePending = promoteUserMutation.isPending || demoteUserMutation.isPending;

  const handleMutationError = (error: unknown, id: string, genericMessage: string) => {
    notificationService.error(translateServerError(t, error, genericMessage), id);
  };

  const handlePromote = async () => {
    const user = userQuery.data;

    if (user === undefined) return;

    const confirmed = await confirm({
      title: t("CONFIRM_PROMOTE_TITLE", { username: user.username }),
      description: t("CONFIRM_PROMOTE_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
    });

    if (!confirmed) return;

    const notificationID = ADMIN_CONSTANT.NOTIFICATION_IDS.PROMOTE_USER;

    notificationService.loading(t("NOTIFICATION_PROMOTE_LOADING"), notificationID);

    promoteUserMutation.mutate(user.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_PROMOTE_SUCCESS"), notificationID);
        void userQuery.refetch();
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_PROMOTE_ERROR")),
    });
  };

  const handleDemote = async () => {
    const user = userQuery.data;

    if (user === undefined) return;

    const confirmed = await confirm({
      title: t("CONFIRM_DEMOTE_TITLE", { username: user.username }),
      description: t("CONFIRM_DEMOTE_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
      variant: "danger",
    });

    if (!confirmed) return;

    const notificationID = ADMIN_CONSTANT.NOTIFICATION_IDS.DEMOTE_USER;

    notificationService.loading(t("NOTIFICATION_DEMOTE_LOADING"), notificationID);

    demoteUserMutation.mutate(user.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_DEMOTE_SUCCESS"), notificationID);
        void userQuery.refetch();
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_DEMOTE_ERROR")),
    });
  };

  return {
    confirmDialog,
    handleDemote,
    handlePromote,
    isDemoteUserPending: demoteUserMutation.isPending,
    isPromoteUserPending: promoteUserMutation.isPending,
    isRolePending,
  };
}
