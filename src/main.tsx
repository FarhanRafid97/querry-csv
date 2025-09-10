import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WrapperDuckdb from "./components/WithDuckdb.tsx";
import "./index.css";
import Layout from "@/components/layouts/layout-sidebar.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WrapperDuckdb>
      <Layout />
      <Toaster position="top-right" richColors closeButton duration={2000} />
    </WrapperDuckdb>
  </StrictMode>
);
