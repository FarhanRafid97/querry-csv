import type { Column, Header } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu-v2";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  DrawingPinFilledIcon,
  DrawingPinIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";

import type { ReactNode } from "react";
import { match } from "ts-pattern";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  header: Header<TData, TValue>;
  children?: ReactNode;
}

export function DataTableColumnHeaderComplete<TData, TValue>({
  column,
  title,
  className,
  header,
  children,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("text-sm font-medium text-gray-700", className)}>
        <span>{title}</span>
        <span className={cn("px-2")}>{children}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex justify-start items-center h-full gap-2"
          style={{
            width: `calc(var(--header-${header.id}-size) * 1px - 16px)`,
          }}
        >
          <div className="truncate overflow-hidden text-start">
            <span className="text-[12px]  font-[600] text-start text-black-shadow ">
              {title}
            </span>
          </div>
          {match(column.getIsSorted())
            .with("desc", () => (
              <ArrowDownIcon
                width={14}
                height={14}
                className=" text-gray-700"
              />
            ))
            .with("asc", () => (
              <ArrowUpIcon width={14} height={14} className=" text-gray-700" />
            ))
            .otherwise(() => (
              <CaretSortIcon
                width={14}
                height={14}
                className=" text-gray-400"
              />
            ))}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className=" border-gray-200 p-1 min-w-[8rem]"
      >
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUpIcon />
          Sort asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDownIcon />
          Sort desc
        </DropdownMenuItem>

        {!header.isPlaceholder && header.column.getCanPin() && (
          <>
            {header.column.getIsPinned() ? (
              <DropdownMenuItem
                onClick={() => {
                  header.column.pin(false);
                }}
              >
                <DrawingPinIcon />
                Unpin column
              </DropdownMenuItem>
            ) : null}
            {header.column.getIsPinned() !== "right" ? (
              <DropdownMenuItem
                onClick={() => {
                  header.column.pin("right");
                }}
              >
                <DrawingPinFilledIcon />
                Pin to right
              </DropdownMenuItem>
            ) : null}
          </>
        )}
        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
          <EyeNoneIcon />
          Hide column
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
