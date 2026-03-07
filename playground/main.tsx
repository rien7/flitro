import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PlaygroundApp } from "./playground-app";
import "../src/index.css";
import "./styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Missing root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <PlaygroundApp />
  </StrictMode>,
);
