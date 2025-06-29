"use client"

import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import { CopyButton } from "@/components/CopyButton"
import { Checkbox } from "@/components/Checkbox"
import WithDrawalActions from "./WithDrawalActions"

type WithdrawalDataColumn = {
  id: string
  inviter: string
  created_at: string
  wallet: string
  sum: number
  uid: string
  tid: string
  MEMO?: string
  status: "new" | "completed" | "declined"
}

const columnHelper = createColumnHelper<WithdrawalDataColumn>()

export const withdrawalColumns: TableColumn<WithdrawalDataColumn>[] = [
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
    header: "ID Транзакції",
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
  columnHelper.accessor("created_at", {
    header: "Час створення",
    cell: ({ getValue }) => new Date(getValue()).toLocaleString("uk-UA"),
  }),
  columnHelper.accessor("inviter", {
    header: "Запросив",
    cell: ({ getValue }) => {
      const inviter = getValue()
      if (!inviter) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="font-medium">{inviter}</span>
          <CopyButton text={inviter} />
        </span>
      )
    },
  }),
  columnHelper.accessor("wallet", {
    header: "Гаманець",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("sum", {
    header: "Сума",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("uid", {
    header: "UID",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("tid", {
    header: "TID",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("MEMO", {
    header: "MEMO",
    cell: ({ getValue }) => getValue() || "-",
  }),
  columnHelper.accessor("status", {
    header: "Статус",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Дії",
    cell: ({ row }) => {
      const { id, status } = row.original

      return status !== 'new' ? <></> : <WithDrawalActions id={id} />
    },
  }),
]
