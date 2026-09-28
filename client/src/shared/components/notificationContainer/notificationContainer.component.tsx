import { useTheme } from "@/features/theme/contexts/theme.context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function NotificationContainerComponent() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme={theme}
    />
  );
}
