import useQuerryStore from "@/store/querry";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useDuckDBStore } from "@/store/duckdb";
import useTableStore from "@/store/table";
import type { TableMetaData } from "@/type/table";

const AddNewTable = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const {
    db,
    connection,
    isInitialized,
    loading,
    error: errorDuckdb,

    executeQuery,
  } = useDuckDBStore();

  const {
    listTable,
    setListTable,

    setSelectedTable,

    setCurrentShowingData,
    setCurrentShowingHeaders,
  } = useTableStore();

  const [headers, setHeaders] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [error, setError] = useState<string>("");
  const {
    setExecutedQuerry,
    historyQuerry,
    setHistoryQuerry,
    currentQuerry,
    setCurrentQuerry,
  } = useQuerryStore();
  console.log(isInitialized);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      loadCSV(e.target.files[0]);
      setCurrentShowingData([]);
      setHeaders([]);
    }
  };

  // Load CSV into DuckDB
  const loadCSV = async (files: File) => {
    if (!files || !connection) {
      setError("Please select a file and initialize DuckDB first");
      return;
    }

    try {
      // Read file as text for Papa Parse
      const fileText = await files.text();
      const uint8Array = new TextEncoder().encode(fileText);

      const tableName =
        "tbl_" +
        files.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_]/g, "_");

      await connection.query(`DROP TABLE IF EXISTS "${tableName}"`);

      await db!.registerFileBuffer(files.name, uint8Array);

      await connection.query(
        `CREATE TABLE "${tableName}" AS SELECT * FROM read_csv_auto('${files.name}', header=true)`
      );

      // Get schema information
      const schemaQuery = await connection.query(`DESCRIBE "${tableName}"`);
      const schemaResult = schemaQuery.toArray();
      const columnNames = schemaResult.map(
        (row: { column_name: string }) => row.column_name
      );
      setHeaders(columnNames);
      setCurrentShowingHeaders(columnNames);

      // Get first 10 rows for preview
      const defaultQuerry = `SELECT * FROM "${tableName}" LIMIT 10`;
      const dataQuery = await connection.query(defaultQuerry);

      setCurrentQuerry(defaultQuerry);
      const dataResult = dataQuery.toArray().map((row) => row.toArray());

      const metadataTable: TableMetaData = {
        label: tableName,
        columns: columnNames,
        total_data: dataResult.length,
      };
      // Update listTable with new table and columns
      const newMap = new Map(listTable);
      newMap.set(tableName, metadataTable);
      setListTable(newMap);
      setSelectedTable(metadataTable);

      setCurrentShowingData(dataResult);
    } catch (err) {
      setError(`Error loading CSV: ${err}`);
      console.error("CSV loading error:", err);
    }
  };

  return (
    <div>
      {" "}
      <input
        className="hidden"
        readOnly
        data-test="upload-file-input"
        accept=".csv"
        ref={inputFileRef}
        onChange={handleFileChange}
        type="file"
      />{" "}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer p-1 h-auto w-fit  has-[>svg]:px-1"
            onClick={() => {
              inputFileRef.current?.click();
            }}
            variant="ghost"
          >
            <PlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={-10}>Add new file</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default AddNewTable;
