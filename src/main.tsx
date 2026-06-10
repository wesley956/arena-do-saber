import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { PwaInstallPrompt } from "./components/PwaInstallPrompt";
import { registerServiceWorker } from "./lib/registerServiceWorker";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <PwaInstallPrompt />
  </StrictMode>
);

registerServiceWorker();
