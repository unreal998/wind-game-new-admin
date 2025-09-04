"use client"

import { CopyButton } from "@/components/CopyButton"
import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import type { TonChange } from "./fetchTonChanges"
import { Checkbox } from "@/components/Checkbox"

const columnHelper = createColumnHelper<TonChange>()

export const getTonChangesColumns = (): TableColumn<TonChange>[] => {
  let columns: TableColumn<TonChange>[] = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomeRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={() => table.toggleAllPageRowsSelected()}
          className="translate-y-0.5"
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={() => row.toggleSelected()}
          className="translate-y-0.5"
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("id", {
      header: "ID",
      cell: ({ getValue }) => {
        const id = getValue()
        return (
          <span className="flex items-center space-x-2">
            <span className="font-medium">{id}</span>
            <CopyButton text={String(id)} />
          </span>
        )
      },
    }),
    columnHelper.accessor("uid", {
      header: "User ID",
      cell: ({ getValue }) => {
        const uid = getValue()
        return (
          <span className="flex items-center space-x-2">
            <span className="font-medium">{uid}</span>
            <CopyButton text={String(uid)} />
          </span>
        )
      },
    }),
    columnHelper.accessor("tid", {
      header: "Telegram ID",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("sum", {
      header: "Sum",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("source", {
      header: "Source",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("created_at", {
      header: "Date",
      cell: ({ getValue }) => new Date(getValue()).toLocaleString("uk-UA"),
    }),
  ]
  return columns
}
