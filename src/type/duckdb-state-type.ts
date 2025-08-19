import * as duckdb from "@duckdb/duckdb-wasm";
// Types (removed duplicate type definitions)
export type DuckDBModule = typeof duckdb;
export type AsyncDuckDBInstance = InstanceType<typeof duckdb.AsyncDuckDB>;
export type DuckDBConnection = Awaited<
  ReturnType<AsyncDuckDBInstance["connect"]>
>;

export interface TableMetaData {
  label: string;
  columns: string[];
  total_data: number;
}
export interface DuckDBState {
  db: AsyncDuckDBInstance | null;
  connection: DuckDBConnection | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  selectedTable: TableMetaData | null;
  listTable: Map<string, TableMetaData>;
  currentShowingData: object[];
}

export interface DuckDBActions {
  initialize: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  executeQuery: (query: string) => Promise<any>;
  closeConnection: () => Promise<void>;
  setError: (error: string) => void;
  setListTable: (listTable: Map<string, TableMetaData>) => void;
  setCurrentShowingData: (currentShowingData: object[]) => void;
  setSelectedTable: (selectedTable: TableMetaData | null) => void;
}

export type DuckDBStore = DuckDBState & DuckDBActions;
