import type { InterfaceAdminSession, InterfaceAdminUser } from "../services/admin.service";
import { useRevokeAllUserSessionsByAdminMutation } from "../mutations/useRevokeAllUserSessionsByAdmin.mutation";
import { useDeleteUserByAdminMutation } from "../mutations/useDeleteUserByAdmin.mutation";
import { useRevokeSessionByAdminMutation } from "../mutations/useRevokeSessionByAdmin.mutation";
import { useDemoteUserByAdminMutation } from "../mutations/useDemoteUserByAdmin.mutation";
import { usePromoteUserByAdminMutation } from "../mutations/usePromoteUserByAdmin.mutation";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { type UseQueryResult } from "@tanstack/react-query";
import { notificationService } from "@/shared/services/notification.service";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog.hook";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { ADMIN_CONSTANT } from "../admin.constant";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";

interface InterfaceAdminUserActionsProps {
  userQuery: UseQueryResult<NoInfer<InterfaceAdminUser>, Error>;
}

export function useAdminUserActions({ userQuery }: InterfaceAdminUserActionsProps) {
  const { confirm, confirmDialog } = useConfirmDialog();
  const { clearSession, user: currentUser } = useAuth();
  const promoteUserByAdminMutation = usePromoteUserByAdminMutation();
  const demoteUserByAdminMutation = useDemoteUserByAdminMutation();
  const deleteUserByAdminMutation = useDeleteUserByAdminMutation();
  const revokeSessionByAdminMutation = useRevokeSessionByAdminMutation();
  const revokeAllUserSessionsByAdminMutation = useRevokeAllUserSessionsByAdminMutation();
  const navigate = useNavigate();
  const { t } = useTranslation("admin");

  const isRolePending = promoteUserByAdminMutation.isPending || demoteUserByAdminMutation.isPending;
  const isUserActionPending =
    isRolePending ||
    deleteUserByAdminMutation.isPending ||
    revokeSessionByAdminMutation.isPending ||
    revokeAllUserSessionsByAdminMutation.isPending;

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

    promoteUserByAdminMutation.mutate(user.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_PROMOTE_SUCCESS"), notificationID);
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

    demoteUserByAdminMutation.mutate(user.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_DEMOTE_SUCCESS"), notificationID);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_DEMOTE_ERROR")),
    });
  };

  const handleDeleteUser = async () => {
    const user = userQuery.data;

    if (user === undefined) return;

    const confirmed = await confirm({
      title: t("CONFIRM_DELETE_USER_TITLE", { username: user.username }),
      description: t("CONFIRM_DELETE_USER_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
      variant: "danger",
    });

    if (!confirmed) return;

    const notificationID = ADMIN_CONSTANT.NOTIFICATION_IDS.DELETE_USER;

    notificationService.loading(t("NOTIFICATION_DELETE_USER_LOADING"), notificationID);

    deleteUserByAdminMutation.mutate(user.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_DELETE_USER_SUCCESS"), notificationID);

        if (currentUser?.id === user.id) {
          clearSession();
          navigate(APP_PATH.HOME);
          return;
        }

        navigate(APP_PATH.ADMIN.USERS);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_DELETE_USER_ERROR")),
    });
  };

  const handleRevokeSession = async (session: InterfaceAdminSession) => {
    const confirmed = await confirm({
      title: t("CONFIRM_REVOKE_SESSION_TITLE"),
      description: t("CONFIRM_REVOKE_SESSION_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
      variant: "danger",
    });

    if (!confirmed) return;

    const notificationID = ADMIN_CONSTANT.NOTIFICATION_IDS.REVOKE_SESSION;

    notificationService.loading(t("NOTIFICATION_REVOKE_SESSION_LOADING"), notificationID);

    revokeSessionByAdminMutation.mutate(session.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_REVOKE_SESSION_SUCCESS"), notificationID);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_REVOKE_SESSION_ERROR")),
    });
  };

  const handleRevokeAllUserSessions = async () => {
    const user = userQuery.data;

    if (user === undefined) return;

    const confirmed = await confirm({
      title: t("CONFIRM_REVOKE_ALL_SESSIONS_TITLE", { username: user.username }),
      description: t("CONFIRM_REVOKE_ALL_SESSIONS_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
      variant: "danger",
    });

    if (!confirmed) return;

    const notificationID = ADMIN_CONSTANT.NOTIFICATION_IDS.REVOKE_ALL_SESSIONS;

    notificationService.loading(t("NOTIFICATION_REVOKE_ALL_SESSIONS_LOADING"), notificationID);

    revokeAllUserSessionsByAdminMutation.mutate(user.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_REVOKE_ALL_SESSIONS_SUCCESS"), notificationID);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_REVOKE_ALL_SESSIONS_ERROR")),
    });
  };

  return {
    confirmDialog,
    handleDeleteUser,
    handleDemote,
    handlePromote,
    handleRevokeAllUserSessions,
    handleRevokeSession,
    isDeleteUserPending: deleteUserByAdminMutation.isPending,
    isDemoteUserPending: demoteUserByAdminMutation.isPending,
    isPromoteUserPending: promoteUserByAdminMutation.isPending,
    isRevokeAllUserSessionsPending: revokeAllUserSessionsByAdminMutation.isPending,
    isUserActionPending,
    revokingSessionId: revokeSessionByAdminMutation.isPending ? revokeSessionByAdminMutation.variables : undefined,
  };
}
