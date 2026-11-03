import "@mark1russell7/site-pages/scroll-cue.css";
import "./style.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = document.getElementById("root");
if (root === null) throw new Error('The page has no element "root".');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
