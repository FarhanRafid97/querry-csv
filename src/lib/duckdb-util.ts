import * as duckdb from "@duckdb/duckdb-wasm";
// Types (removed duplicate type definitions)
export type DuckDBModule = typeof duckdb;
export type AsyncDuckDBInstance = InstanceType<typeof duckdb.AsyncDuckDB>;
export type DuckDBConnection = Awaited<
  ReturnType<AsyncDuckDBInstance["connect"]>
>;
import type { TableMetaData } from "@/type/table";
import { toast } from "sonner";
import { detectDelimiter } from "./utils";

export const loadCSV = async (
  files: File,
  connection: DuckDBConnection,
  db: AsyncDuckDBInstance
): Promise<{ tableName: string; metadataTable: TableMetaData }> => {
  if (!files || !connection) {
    return {
      tableName: "",
      metadataTable: { label: "", columns: [], total_data: 0 },
    };
  }

  try {
    // Read file as text for Papa Parse
    const fileText = await files.text();
    const uint8Array = new TextEncoder().encode(fileText);
    const delim = detectDelimiter(fileText);
    const tableName =
      "tbl_" +
      files.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "_");

    await connection.query(`DROP TABLE IF EXISTS "${tableName}"`);

    await db!.registerFileBuffer(files.name, uint8Array);

    await connection.query(
      `CREATE TABLE "${tableName}" AS SELECT * FROM read_csv_auto('${files.name}', header=true, delim='${delim}')`
    );

    const schemaQuery = await connection.query(`DESCRIBE "${tableName}"`);
    const schemaResult = schemaQuery.toArray();
    const columnNames = schemaResult.map(
      (row: { column_name: string }) => row.column_name
    );
    const metadataTable: TableMetaData = {
      label: tableName,
      columns: columnNames,
      total_data: 0,
    };

    return { tableName, metadataTable };

    toast.success("CSV loaded successfully with table name: " + tableName);
    return { tableName, metadataTable };
  } catch (err) {
    console.error("CSV loading error:", err);
    toast.error("CSV loading error: " + err);
    return {
      tableName: "",
      metadataTable: { label: "", columns: [], total_data: 0 },
    };
  }
};
