import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./app/app";
import "./features/locale/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
