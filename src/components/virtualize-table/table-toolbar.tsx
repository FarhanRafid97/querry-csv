import { type Dispatch, type SetStateAction } from 'react';
import { DataGridRowHeightMenu } from './select-column-height';
import type { Table } from '@tanstack/react-table';
import SearchTable from './search-table';
import { DataTableViewOptions } from './data-table-view-options';

export default function TableToolbar({
  table,
  search,
  setSearch
}: {
  table: Table<object>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex items-center gap-2 justify-between">
      <SearchTable search={search} setSearch={setSearch} />
      <div className="flex items-center gap-2">
        <DataGridRowHeightMenu table={table} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
