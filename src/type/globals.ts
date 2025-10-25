import { type Table } from "@tanstack/react-table";
import { type SetStateAction } from "react";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  setSearch: React.Dispatch<SetStateAction<string>>;

  id?: string;
  isPending?: boolean;
}
