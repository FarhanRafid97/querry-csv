import { cn } from "@/lib/utils";
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Virtualizer } from "@tanstack/react-virtual";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { type CSSProperties } from "react";
import { match } from "ts-pattern";
import {
  TableBody as TableBodyComp,
  TableCell,
  Table as TableComp,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table_v2";
import { DataTablePagination } from "./data-table-pagination";
import SearchTable from "./search-table";
import WrapperVirtualizeTable from "./wrapper-virtualize-table";

function getCommonPinningStyles<T>(
  column: Column<T>,
  isHeader?: boolean
): CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");
  let paddingLeftValue = "10px";

  if (isFirstRightPinnedColumn) {
    paddingLeftValue = "30px";
  } else if (isHeader) {
    paddingLeftValue = "0px";
  }

  return {
    boxShadow: match(isLastLeftPinnedColumn)
      .with(true, () => "-4px 0 4px -4px gray inset")
      .otherwise(() =>
        match(isFirstRightPinnedColumn)
          .with(true, () => "4px 0 4px -4px gray inset")
          .otherwise(() => "")
      ),

    paddingLeft: paddingLeftValue,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,

    position: isPinned ? "sticky" : "relative",
    zIndex: isPinned ? 1 : 0,
  };
}

export function VirtualizeTable({
  columns,
  data,
}: {
  columns: ColumnDef<object>[];
  data: object[];
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter: search,
      columnFilters,
    },

    initialState: {
      columnPinning: {
        right: [],
      },
      pagination: {
        pageSize: 100,
      },
    },
    defaultColumn: {
      minSize: 70,
      maxSize: 600,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearch,
    columnResizeMode: "onChange",

    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const tableContainerRef = React.useRef<HTMLTableElement>(null);

  const columnSizingInfo = table.getState().columnSizingInfo;
  const columnSizing = table.getState().columnSizing;

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }

    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizingInfo, columnSizing, table]);

  const isSizing = React.useMemo(() => {
    return table.getState().columnSizingInfo.isResizingColumn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo.isResizingColumn]);

  console.log("rerender");
  return (
    <div className="w-full h-full    flex flex-col gap-2">
      <div className="px-6">
        <SearchTable search={search} setSearch={setSearch} />
      </div>
      <div className="rounded-none overflow-hidden border-t border-b ">
        <WrapperVirtualizeTable ref={tableContainerRef} className="">
          <TableComp
            className="w-full relative"
            style={{
              display: "grid",
              ...columnSizeVars,
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted"
                  style={{ display: "flex", width: "100%" }}
                >
                  {headerGroup.headers.map((header) => {
                    const isPined = header.column.getIsPinned();
                    return (
                      <TableHead
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        key={header.id}
                        className={cn(
                          "grid place-items-center h-8",
                          isPined ? " bg-background backdrop-blur-md" : ""
                        )}
                        style={{
                          ...getCommonPinningStyles(header.column, true),
                          width: `calc(var(--header-${header?.id}-size) * 1px)`,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.id === "actions" ? null : (
                          <div
                            {...{
                              onDoubleClick: () => header.column.resetSize(),

                              className: ` ${
                                isPined ? "resizer-left" : "resizer"
                              } ${
                                header.column.getIsResizing()
                                  ? "isResizing"
                                  : ""
                              }`,
                            }}
                          >
                            <div className="w-[2px] h-full bg-gray-300 rounded-sm" />
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {isSizing ? (
              <MemoizedTableBodyWrapper
                table={table}
                tableContainerRef={tableContainerRef}
              />
            ) : (
              <TableBodyWrapper
                table={table}
                tableContainerRef={tableContainerRef}
              />
            )}
          </TableComp>
        </WrapperVirtualizeTable>
      </div>
      <div className="px-6 pb-4 ">
        {" "}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

export const MemoizedTableBodyWrapper = React.memo(
  TableBodyWrapper
) as React.FC<TableBodyWrapperProps>;

interface TableBodyWrapperProps {
  table: Table<object>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
}

function TableBodyWrapper({ table, tableContainerRef }: TableBodyWrapperProps) {
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 28,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  React.useLayoutEffect(() => {
    rowVirtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length]);

  return <TableBody rowVirtualizer={rowVirtualizer} table={table} />;
}

interface TableBodyProps {
  table: Table<object>;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

function TableBody({ rowVirtualizer, table }: TableBodyProps) {
  const { rows } = table.getRowModel();
  const virtualRows = rowVirtualizer.getVirtualItems();
  console.log(virtualRows);
  return (
    <TableBodyComp
      style={{
        display: "grid",
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: "relative",
      }}
    >
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index];
        return (
          <TableBodyRowMemo
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
          />
        );
      })}
    </TableBodyComp>
  );
}

interface TableBodyRowProps {
  row: Row<object>;
  virtualRow: ReturnType<
    Virtualizer<HTMLDivElement, HTMLTableRowElement>["getVirtualItems"]
  >[number];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

function TableBodyRow({ row, virtualRow, rowVirtualizer }: TableBodyRowProps) {
  return (
    <TableRow
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      key={row.id}
      style={{
        display: "flex",
        position: "absolute",

        transform: `translateY(${virtualRow.start}px)`,
        width: "100%",
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <TableCell
            key={cell.id}
            className={cn(
              "flex justify-start w-full",
              cell.column.getIsPinned() ? " bg-background" : ""
            )}
            style={{
              ...getCommonPinningStyles(cell.column),
              width: `calc(calc(var(--col-${cell.column.id}-size) * 1px) - 4px)`,
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

const TableBodyRowMemo = React.memo(TableBodyRow, (prev, next) => {
  // Only skip re-render if scrolling and the row index hasn't changed
  return (
    next.rowVirtualizer.isScrolling &&
    prev.virtualRow.index === next.virtualRow.index
  );
}) as typeof TableBodyRow;
