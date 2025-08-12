import React from "react";
import { useAutoInitializeDuckDB } from "../store/duckdb";

const WrapperDuckdb = ({ children }: { children: React.ReactNode }) => {
  const { loading, error } = useAutoInitializeDuckDB();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <>{children}</>;
};

export default WrapperDuckdb;
