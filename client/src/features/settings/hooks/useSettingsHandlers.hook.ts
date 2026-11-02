import { useDeleteUserMutation } from "@/features/users/mutations/useDeleteUser.mutation";
import { useLogoutAllMutation } from "@/features/auth/mutations/useLogoutAll.mutation";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { notificationService } from "@/shared/services/notification.service";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog.hook";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { SETTINGS_CONSTANT } from "../constants/settings.constant";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { APP_PATH } from "@/app/app.path";
import { useState } from "react";

export function useSettingsHandlers() {
  const { signOut, clearSession } = useAuth();
  const logoutAllMutation = useLogoutAllMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const { confirm, confirmDialog } = useConfirmDialog();
  const { t } = useTranslation("settings");
  const navigate = useNavigate();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const isBusy = isSigningOut || logoutAllMutation.isPending || deleteUserMutation.isPending;

  const handleMutationError = (error: unknown, id: string, genericMessage: string) => {
    notificationService.error(translateServerError(t, error, genericMessage), id);
  };

  const handleSignOut = async () => {
    const confirmed = await confirm({
      title: t("CONFIRM_SIGN_OUT_TITLE"),
      description: t("CONFIRM_SIGN_OUT_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
    });

    if (!confirmed) return;

    const notificationID = SETTINGS_CONSTANT.NOTIFICATION_IDS.SIGN_OUT;

    setIsSigningOut(true);
    notificationService.loading(t("NOTIFICATION_SIGN_OUT_LOADING"), notificationID);

    try {
      await signOut();
      notificationService.success(t("NOTIFICATION_SIGN_OUT_SUCCESS"), notificationID);
    } catch {
      notificationService.error(t("NOTIFICATION_SIGN_OUT_ERROR"), notificationID);
    } finally {
      setIsSigningOut(false);
      navigate(APP_PATH.HOME);
    }
  };

  const handleLogoutAll = async () => {
    const confirmed = await confirm({
      title: t("CONFIRM_LOGOUT_ALL_TITLE"),
      description: t("CONFIRM_LOGOUT_ALL_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
    });

    if (!confirmed) return;

    const notificationID = SETTINGS_CONSTANT.NOTIFICATION_IDS.LOGOUT_ALL;

    notificationService.loading(t("NOTIFICATION_LOGOUT_ALL_LOADING"), notificationID);

    logoutAllMutation.mutate(undefined, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_LOGOUT_ALL_SUCCESS"), notificationID);

        clearSession();
        navigate(APP_PATH.HOME);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_LOGOUT_ALL_ERROR")),
    });
  };

  const handleDeleteUser = async () => {
    const confirmed = await confirm({
      title: t("CONFIRM_DELETE_USER_TITLE"),
      description: t("CONFIRM_DELETE_USER_DESCRIPTION"),
      confirmLabel: t("CONFIRM_YES"),
      cancelLabel: t("CONFIRM_NO"),
      variant: "danger",
    });

    if (!confirmed) return;

    const notificationID = SETTINGS_CONSTANT.NOTIFICATION_IDS.DELETE_USER;

    notificationService.loading(t("NOTIFICATION_DELETE_USER_LOADING"), notificationID);

    deleteUserMutation.mutate(undefined, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_DELETE_USER_SUCCESS"), notificationID);

        clearSession();
        navigate(APP_PATH.HOME);
      },
      onError: (error) => handleMutationError(error, notificationID, t("NOTIFICATION_DELETE_USER_ERROR")),
    });
  };

  return {
    confirmDialog,
    handleDeleteUser,
    handleLogoutAll,
    handleSignOut,
    isBusy,
    isDeleteUserPending: deleteUserMutation.isPending,
    isLogoutAllPending: logoutAllMutation.isPending,
    isSigningOut,
  };
}
