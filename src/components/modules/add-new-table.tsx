import { useDuckDBStore } from "@/store/duckdb";
import { PlusIcon } from "@radix-ui/react-icons";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";
import type { TableMetaData } from "@/type/table";
import useTableStore from "@/store/table";
import { detectDelimiter } from "@/lib/utils";

const AddNewTable = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { db, connection } = useDuckDBStore();
  const { listTable, setListTable } = useTableStore();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("CSV file size exceeds 5MB limit.");
        return;
      }
      loadCSV(file);
    }
  };

  // Load CSV into DuckDB
  const loadCSV = async (files: File) => {
    if (!files || !connection) {
      return;
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

      const newMap = new Map(listTable);
      newMap.set(tableName, metadataTable);
      setListTable(newMap);

      toast.success("CSV loaded successfully with table name: " + tableName);
    } catch (err) {
      console.error("CSV loading error:", err);
      toast.error("CSV loading error: " + err);
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
