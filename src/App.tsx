import React, { useState } from "react";
import { useDuckDBStore } from "./store/duckdb";
import OutputData from "./components/modules/output-data";
import Papa from "papaparse";
function CSVDuckDBReader() {
  const {
    db,
    connection,
    isInitialized,
    loading,
    error: errorDuckdb,
    executeQuery,
  } = useDuckDBStore();
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [listTable, setListTable] = useState<Map<string, string[]>>(new Map());
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const [error, setError] = useState<string>("");
  const [customQuery, setCustomQuery] = useState("");
  console.log(isInitialized);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      loadCSV(e.target.files[0]);
      setData([]);
      setHeaders([]);
      setQueryResult([]);
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

      // Parse CSV with Papa Parse to handle all delimiters automatically
      const parseResult = Papa.parse(fileText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: async (results) => {
          try {
            console.log("ini parseResult", results.data);
            // Convert parsed data back to CSV format for DuckDB
            const csvData = Papa.unparse(results.data, {
              header: true,
            });

            // Create ArrayBuffer from the processed CSV data
            const uint8Array = new TextEncoder().encode(csvData);
            console.log(files.name);

            // Register the file with DuckDB
            await db!.registerFileBuffer(files.name, uint8Array);

            // Use a simple, valid table name (remove extension and special chars)
            const baseName = files.name
              .replace(/\.[^/.]+$/, "")
              .replace(/[^a-zA-Z0-9_]/g, "_");
            const tableName = `csv_${baseName}`;

            // Drop table if exists
            await connection.query(`DROP TABLE IF EXISTS "${tableName}"`);

            // Create table from CSV
            await connection.query(
              `CREATE TABLE "${tableName}" AS SELECT * FROM read_csv_auto('${files.name}', header=true)`
            );

            // Get schema information
            const schemaQuery = await connection.query(
              `DESCRIBE "${tableName}"`
            );
            const schemaResult = schemaQuery.toArray();
            const columnNames = schemaResult.map(
              (row: { column_name: string }) => row.column_name
            );
            setHeaders(columnNames);

            // Update listTable with new table and columns
            setListTable((prev) => {
              const newMap = new Map(prev);
              newMap.set(tableName, columnNames);
              return newMap;
            });
            setSelectedTable(tableName);

            // Get first 10 rows for preview
            const defaultQuerry = `SELECT * FROM "${tableName}" LIMIT 10`;
            const dataQuery = await connection.query(defaultQuerry);
            console.log("ini dataQuery");
            setCustomQuery(defaultQuerry);
            const dataResult = dataQuery
              .toArray()
              .map((row: any) => row.toArray());
            setData(dataResult);
          } catch (err) {
            setError(`Error processing CSV data: ${err}`);
            console.error("CSV processing error:", err);
          }
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          console.error("CSV parsing error:", error);
        },
      });
    } catch (err) {
      setError(`Error loading CSV: ${err}`);
      console.error("CSV loading error:", err);
    }
  };

  const handleExecuteQuery = async () => {
    setError("");
    try {
      // Extract the table name from the customQuery if it matches the pattern FROM "csv_<something>", FROM 'csv_<something>', or FROM csv_<something>

      const [resultData, error] = await executeQuery(customQuery);
      console.log("ini result", resultData);
      console.log("ini error", `${error}`);
      if (error) {
        setError(error);
        return;
      }
      let extractedTableName = null;
      const tableNameMatch = customQuery.match(
        /FROM\s+["'`]?(csv_[a-zA-Z0-9_]+)["'`]?/i
      );
      if (tableNameMatch && tableNameMatch[1]) {
        extractedTableName = tableNameMatch[1];
        console.log("Extracted table name:", extractedTableName);
        setSelectedTable(extractedTableName);
      }
      const { result, headers } = resultData;
      const arrayData = result.toArray().map((row: any) => row.toArray());
      setHeaders(headers);
      console.log("dada", arrayData);
      setData(arrayData);
    } catch (error) {
      console.log("ini error", error);
      setError(error as string);
    }
  };
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        DuckDB CSV Reader
      </h1>

      {/* Initialize DuckDB */}

      {/* File Upload */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => {
            if (csvFile) {
              loadCSV(csvFile);
            }
          }}
          disabled={!csvFile || !connection || loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load CSV into DuckDB"}
        </button>
      </div>
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      {errorDuckdb && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{errorDuckdb}</p>
        </div>
      )}
      {/* Custom Query */}
      {data.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Custom Query</h2>
          <textarea
            style={{
              resize: "vertical",
              width: "100%",
              height: "100px",
            }}
            onKeyDown={async (e) => {
              if (e.altKey || e.metaKey) {
                e.stopPropagation();
              }

              // For Mac: Cmd+Enter (metaKey), for Windows/Linux: Alt+Enter (altKey)
              if (e.key === "Enter" && (e.altKey || e.metaKey)) {
                e.preventDefault();
                handleExecuteQuery();
              }
            }}
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 h-24 font-mono text-sm"
            placeholder="Enter SQL query here..."
          />
          <button
            onClick={async () => {
              handleExecuteQuery();
            }}
            disabled={!connection || loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Execute Query
          </button>
          {data.length > 0 && selectedTable && (
            <OutputData data={data} headers={headers} />
          )}

          <div className="mt-4 text-sm text-gray-600">
            {Array.from(listTable.entries()).map(([tableName, columnNames]) => (
              <div key={tableName}>
                <h3>{tableName}</h3>
                <p>{columnNames.join(", ")}</p>
              </div>
            ))}
            <p>
              <strong>Example queries:</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>SELECT * FROM csv_data LIMIT 5</li>
              <li>SELECT COUNT(*) FROM csv_data</li>
              <li>
                SELECT column_name, COUNT(*) FROM csv_data GROUP BY column_name
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Data Display */}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Click "Initialize DuckDB" to set up the database</li>
          <li>Select a CSV file using the file input</li>
          <li>Click "Load CSV into DuckDB" to import the data</li>
          <li>View the data preview or run custom SQL queries</li>
        </ol>
      </div>
    </div>
  );
}

export default CSVDuckDBReader;
