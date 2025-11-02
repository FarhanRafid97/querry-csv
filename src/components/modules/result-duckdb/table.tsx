import { TableCellCostume } from '@/components/virtualize-table/cell';
import { VirtualizeTable } from '@/components/virtualize-table/table';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { generateColumns } from './column';
import { DataTableColumnHeaderComplete } from '@/components/virtualize-table/header';

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
          <VirtualizeTable
            data={tableData || []}
            columns={
              [
                {
                  accessorKey: 'No',
                  minSize: 60,

                  header: ({ column, header }) => (
                    <DataTableColumnHeaderComplete noDropdown column={column} title="No" header={header} />
                  ),
                  cell: ({ row, column }) => <TableCellCostume id={column.id}>{row.index + 1}</TableCellCostume>
                },
                ...columns
              ] as ColumnDef<object>[]
            }
          />
        </>
      ) : (
        <div className="w-full h-full flex flex-col">
          <p>No data</p>
        </div>
      )}
    </div>
  );
}
