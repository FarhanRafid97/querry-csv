import { VirtualizeTable } from '@/components/virtualize-table/table';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { generateColumns } from './column';

export default function TableTanstack({
  data,
  headers
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[][];
  headers: string[];
}) {
  const columns = generateColumns(headers);
  const tableData = useMemo(() => {
    return data.map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: Record<string, any> = {};
      headers.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
  }, [data, headers]);
  console.log(tableData);

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {tableData.length > 0 ? (
        <>
          <VirtualizeTable data={tableData || []} columns={columns as ColumnDef<object>[]} />
        </>
      ) : (
        <div className="w-full h-full flex flex-col">
          <p>No data</p>
        </div>
      )}
    </div>
  );
}
