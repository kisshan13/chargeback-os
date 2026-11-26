import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./router";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("The app root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
