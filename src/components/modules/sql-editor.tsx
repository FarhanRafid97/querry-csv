import { useEffect, useRef } from "react";
import { CodeEditor } from "../ui/code-editor";
import type { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { getKeyCombo } from "@/lib/utils";
import { useDuckDBStore } from "@/store/duckdb";
import useQuerryStore from "@/store/querry";
import useTableStore from "@/store/table";

const SQLEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { executeQuery } = useDuckDBStore();

  const {
    currentQuerry,
    executedQuerry,
    setCurrentQuerry,
    setExecutedQuerry,
    setErrorQuerry,
  } = useQuerryStore();

  const {
    setCurrentShowingDataMultiple,
    setCurrentShowingHeadersMultiple,
    setSelectedTable,
    listTable,
  } = useTableStore();
  console.log(currentQuerry);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.onKeyDown(async (e) => {
      const combo = getKeyCombo(e);

      if (combo === "Ctrl+3") {
        e.preventDefault();
        e.stopPropagation();
        const selection = editor.getSelection();

        let queryToExecute = "";

        if (selection && !selection.isEmpty()) {
          // Execute selected text
          queryToExecute = editor.getModel()?.getValueInRange(selection) || "";
        }
        if (queryToExecute == "" || queryToExecute === executedQuerry) {
          console.log("queryToExecute is empty or same as executedQuerry");
          return;
        }
        const splitquerry = queryToExecute.split(";");
        const multipleData: [][] = [];
        const multipleHeaders: [][] = [];
        splitquerry.forEach(async (querry) => {
          if (!querry.trim()) {
            return;
          }
          const [resultData, error] = await executeQuery(querry);
          setExecutedQuerry(querry);
          if (error) {
            console.log("tpeof error: " + typeof error);
            setErrorQuerry(error);
            setCurrentShowingDataMultiple([]);
            setCurrentShowingHeadersMultiple([]);

            return;
          }
          let extractedTableName = null;
          const tableNameMatch = currentQuerry.match(
            /FROM\s+["'`]?(csv_[a-zA-Z0-9_]+)["'`]?/i
          );
          if (tableNameMatch && tableNameMatch[1]) {
            extractedTableName = tableNameMatch[1];

            setSelectedTable(listTable.get(extractedTableName) || null);
          }

          const { result, headers } = resultData;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const arrayData = result.toArray().map((row: any) => row.toArray());
          multipleData.push(arrayData);
          multipleHeaders.push(headers);
        });
        setErrorQuerry("");

        setCurrentShowingDataMultiple(multipleData);
        setCurrentShowingHeadersMultiple(multipleHeaders);
      }
    });
  };

  return (
    <CodeEditor
      className="h-full min-h-[50vh] pt-2"
      defaultLanguage="sql"
      value={currentQuerry}
      defaultValue="// some comment"
      onMount={handleEditorDidMount}
      onChange={(value) => setCurrentQuerry(value || "")}
    />
  );
};

export default SQLEditor;
