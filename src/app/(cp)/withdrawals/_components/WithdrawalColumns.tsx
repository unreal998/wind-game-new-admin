"use client"

import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import { CopyButton } from "@/components/CopyButton"
import { Checkbox } from "@/components/Checkbox"
import WithDrawalActions from "./WithDrawalActions"

type WithdrawalDataColumn = {
  id: string
  updated_at: string
  inviter: string
  team: string
  created_at: string
  wallet: string
  sum: number
  fee?: number
  sumfee?: number
  uid: string
  tid: string
  MEMO?: string
  status: "new" | "completed" | "declined"
}

const columnHelper = createColumnHelper<WithdrawalDataColumn>()

export const getWithdrawalColumns = (
  isAvialableToWrite: boolean,
): TableColumn<WithdrawalDataColumn>[] => {
  let columns = [
    columnHelper.display({
      id: "actions",
      header: "Дії",
      cell: ({ row }) => {
        const { id, status } = row.original
        return isAvialableToWrite && status !== "new" ? null : <WithDrawalActions id={id} />
      },
      enableSorting: false,
      enableHiding: false,
    }),
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
    columnHelper.accessor("updated_at", {
      header: "Час оновлення",
      cell: ({ getValue }) => new Date(getValue()).toLocaleString("uk-UA"),
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
    columnHelper.accessor("team", {
      header: "Команда",
      cell: ({ getValue }) => {
        const value = getValue()
        return <span className="max-w-[160px] truncate">{value}</span>
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
    columnHelper.accessor("fee", {
      header: "Комісія",
      cell: ({ row }) => row.original.sum * 0.02,
    }),
    columnHelper.accessor("sumfee", {
      header: "Сума з комісією",
      cell: ({ row }) => row.original.sum * 0.98,
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
  ]
  return columns
}
