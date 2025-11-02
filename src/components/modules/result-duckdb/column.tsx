import { TableCellCostume } from '@/components/virtualize-table/cell';
import { DataTableColumnHeaderComplete } from '@/components/virtualize-table/header';
import { type ColumnDef } from '@tanstack/react-table';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateColumns = (columns: string[]): ColumnDef<any, any>[] => {
  return columns.map((col) => ({
    accessorKey: col,

    header: ({ column, header }) => (
      <DataTableColumnHeaderComplete header={header} className="whitespace-nowrap" column={column} title={col} />
    ),
    cell: ({ row, column }) => <TableCellCostume id={column.id}>{row.original[col]}</TableCellCostume>
  }));
};
