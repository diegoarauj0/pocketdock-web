import type { InterfaceAdminSession, InterfaceAdminUser } from "../services/admin.service";
import { useRevokeAllUserSessionsMutation } from "../mutations/useRevokeAllUserSessions.mutation";
import { useDeleteUserMutation } from "../mutations/useDeleteUser.mutation";
import { useRevokeSessionMutation } from "../mutations/useRevokeSession.mutation";
import { useDemoteUserMutation } from "../mutations/useDemoteUser.mutation";
import { usePromoteUserMutation } from "../mutations/usePromoteUser.mutation";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useQueryClient, type UseQueryResult } from "@tanstack/react-query";
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
  const promoteUserMutation = usePromoteUserMutation();
  const demoteUserMutation = useDemoteUserMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const revokeSessionMutation = useRevokeSessionMutation();
  const revokeAllUserSessionsMutation = useRevokeAllUserSessionsMutation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation("admin");

  const isRolePending = promoteUserMutation.isPending || demoteUserMutation.isPending;
  const isUserActionPending =
    isRolePending ||
    deleteUserMutation.isPending ||
    revokeSessionMutation.isPending ||
    revokeAllUserSessionsMutation.isPending;

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

    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_DELETE_USER_SUCCESS"), notificationID);

        queryClient.removeQueries({ queryKey: ["admin", "user", user.id] });

        void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        void queryClient.invalidateQueries({ queryKey: ["admin", "instances"] });
        void queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] });

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

    revokeSessionMutation.mutate(session.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_REVOKE_SESSION_SUCCESS"), notificationID);
        void queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] });
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

    revokeAllUserSessionsMutation.mutate(user.id, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_REVOKE_ALL_SESSIONS_SUCCESS"), notificationID);
        void queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] });
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
    isDeleteUserPending: deleteUserMutation.isPending,
    isDemoteUserPending: demoteUserMutation.isPending,
    isPromoteUserPending: promoteUserMutation.isPending,
    isRevokeAllUserSessionsPending: revokeAllUserSessionsMutation.isPending,
    isUserActionPending,
    revokingSessionId: revokeSessionMutation.isPending ? revokeSessionMutation.variables : undefined,
  };
}
