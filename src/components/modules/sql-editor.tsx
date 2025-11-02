import { getKeyCombo } from '@/lib/utils';
import { useDuckDBStore } from '@/store/duckdb';
import useQuerryStore from '@/store/querry';
import useTableStore from '@/store/table';
import type { TableMetaData } from '@/type/table';
import type { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useRef } from 'react';
import { CodeEditor } from '../ui/code-editor';

const SQLEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { executeQuery, connection } = useDuckDBStore();

  const { currentQuerry, executedQuerry, setCurrentQuerry, setExecutedQuerry, setErrorQuerry } = useQuerryStore();

  const { setCurrentShowingDataMultiple, setCurrentShowingHeadersMultiple, setSelectedTable, listTable, setListTable } =
    useTableStore();

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    if (!connection) {
      return;
    }

    editor.onKeyDown(async (e) => {
      const combo = getKeyCombo(e);

      if (combo === 'Ctrl+3') {
        e.preventDefault();
        e.stopPropagation();
        const selection = editor.getSelection();

        let queryToExecute = '';

        if (selection && !selection.isEmpty()) {
          // Execute selected text
          queryToExecute = editor.getModel()?.getValueInRange(selection) || '';
        }
        if (queryToExecute == '' || queryToExecute === executedQuerry) {
          console.log('queryToExecute is empty or same as executedQuerry');
          return;
        }
        // Remove line comments (--) and ignore lines that are only comments

        const splitquerry = queryToExecute.split(';');
        const multipleData: [][] = [];
        const multipleHeaders: [][] = [];
        splitquerry.forEach(async (querry) => {
          const cleanQury = querry.trim();
          if (!cleanQury) {
            return;
          }
          const [resultData, error] = await executeQuery(cleanQury);
          setExecutedQuerry(querry);
          console.log('ini querry: asdas ', cleanQury.toUpperCase().startsWith('CREATE TABLE'));
          if (error) {
            console.log('tpeof error: ' + typeof error);
            setErrorQuerry(error);
            setCurrentShowingDataMultiple([]);
            setCurrentShowingHeadersMultiple([]);

            return;
          }
          let extractedTableName = null;
          const tableNameMatch = currentQuerry.match(/FROM\s+["'`]?(csv_[a-zA-Z0-9_]+)["'`]?/i);
          if (tableNameMatch && tableNameMatch[1]) {
            extractedTableName = tableNameMatch[1];

            setSelectedTable(listTable.get(extractedTableName) || null);
          }
          console.log(cleanQury.toUpperCase());
          if (cleanQury.toUpperCase().startsWith('CREATE TABLE')) {
            const resultDataShowTables = await connection.query('SHOW TABLES');
            const tables = resultDataShowTables.toArray().map((row: { name: string }) => row.name);

            const newMap = new Map<string, TableMetaData>();
            await Promise.all(
              tables.map(async (table: string) => {
                const schemaQuery = await connection.query(`DESCRIBE "${table}"`);
                const schemaResult = schemaQuery.toArray();
                const columnNames = schemaResult.map((row: { column_name: string }) => row.column_name);
                const metaDataTable: TableMetaData = { label: table, columns: columnNames, total_data: 0 };

                newMap.set(table, metaDataTable);
              })
            );
            setListTable(newMap);
            multipleData.push([]);
            multipleHeaders.push([]);
          } else {
            const { result, headers } = resultData;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const arrayData = result.toArray().map((row: any) => row.toArray());
            multipleData.push(arrayData);
            multipleHeaders.push(headers);
          }
        });

        setErrorQuerry('');

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
      onChange={(value) => setCurrentQuerry(value || '')}
    />
  );
};

export default SQLEditor;
