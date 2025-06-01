"use client"

import { cx } from "@/lib/utils"
import {
  RiArrowDownLine,
  RiArrowUpDownLine,
  RiArrowUpLine,
} from "@remixicon/react"
import { Column } from "@tanstack/react-table"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: React.ReactNode
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cx(className)}>{title}</div>
  }

  return (
    <div
      onClick={column.getToggleSortingHandler()}
      className={cx(
        column.columnDef.enableSorting === true
          ? "-mx-2 inline-flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50 hover:dark:bg-gray-900"
          : "inline-flex select-none items-center gap-2 py-1",
      )}
    >
      <span>{title}</span>
      {column.getCanSort() ? (
        <div className="ml-2">
          {column.getIsSorted() === "desc" ? (
            <RiArrowDownLine className="size-4" />
          ) : column.getIsSorted() === "asc" ? (
            <RiArrowUpLine className="size-4" />
          ) : (
            <RiArrowUpDownLine className="size-4 text-gray-400" />
          )}
        </div>
      ) : null}
    </div>
  )
}
