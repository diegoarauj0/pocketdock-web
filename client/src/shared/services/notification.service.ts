import { NOTIFICATION_CONSTANT } from "@/shared/constants/notification.constant";
import { toast } from "react-toastify";

export const notificationService = {
  loading: (content: string, notificationID?: string): string => {
    if (notificationID && toast.isActive(notificationID || "")) {
      toast.update(notificationID || "", {
        autoClose: NOTIFICATION_CONSTANT.NOTIFICATION_AUTO_CLOSE,
        isLoading: true,
        render: content,
      });

      return notificationID;
    }

    return toast(content, { isLoading: true, toastId: notificationID }) as string;
  },

  success: (content: string, notificationID?: string): string | undefined => {
    if (notificationID && toast.isActive(notificationID || "")) {
      toast.update(notificationID, {
        autoClose: NOTIFICATION_CONSTANT.NOTIFICATION_AUTO_CLOSE,
        isLoading: false,
        render: content,
        type: "success",
      });

      return;
    }

    return toast(content, { type: "success", toastId: notificationID }) as string;
  },

  error: (content: string, notificationID?: string): string | undefined => {
    if (notificationID && toast.isActive(notificationID || "")) {
      toast.update(notificationID, {
        autoClose: NOTIFICATION_CONSTANT.NOTIFICATION_AUTO_CLOSE,
        isLoading: false,
        render: content,
        type: "error",
      });

      return;
    }

    return toast(content, { type: "error", toastId: notificationID }) as string;
  },

  warning: (content: string, notificationID?: string): string | undefined => {
    if (notificationID && toast.isActive(notificationID || "")) {
      toast.update(notificationID, {
        autoClose: NOTIFICATION_CONSTANT.NOTIFICATION_AUTO_CLOSE,
        isLoading: false,
        render: content,
        type: "warning",
      });

      return;
    }

    return toast(content, { type: "warning", toastId: notificationID }) as string;
  },

  clear: (notificationID: string) => {
    toast.dismiss(notificationID);
  },
};
