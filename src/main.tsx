import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WrapperDuckdb from "./components/WithDuckdb.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WrapperDuckdb>
      <App />
    </WrapperDuckdb>
  </StrictMode>
);
