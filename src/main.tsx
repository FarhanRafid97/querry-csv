import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import WrapperDuckdb from "./components/WithDuckdb.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WrapperDuckdb>
      <App />
    </WrapperDuckdb>
  </StrictMode>
);
