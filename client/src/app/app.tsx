import { NotificationContainerComponent } from "@/shared/components/notificationContainer/notificationContainer.component";
import { GlobalStyle } from "@/features/theme/global.styled";
import { AppProviders } from "./app.providers";
import { RouterProvider } from "react-router";
import { router } from "./app.router";

export function App() {
  return (
    <AppProviders>
      <GlobalStyle />
      <NotificationContainerComponent />
      <RouterProvider router={router} />
    </AppProviders>
  );
}
