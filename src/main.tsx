import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WrapperDuckdb from "./components/WithDuckdb.tsx";
import "./index.css";
import Layout from "@/components/layouts/layout-sidebar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WrapperDuckdb>
      <Layout />
    </WrapperDuckdb>
  </StrictMode>
);
