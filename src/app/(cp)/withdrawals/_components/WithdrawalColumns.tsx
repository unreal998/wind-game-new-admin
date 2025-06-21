"use client"

import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import { CopyButton } from "@/components/CopyButton"
import { Button } from "@/components"
import { fetchUpdateWithDrawStatus } from "./fetchWithdrawal"
import { Checkbox } from "@/components/Checkbox"

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
      const { id } = row.original

      const handleApprove = async () => {
        try {
          await fetchUpdateWithDrawStatus({ id, status: "completed" })
          console.log(`✅ Погоджено ${id}`)
        } catch (error) {
          console.error("❌ Помилка при погодженні:", error)
        }
      }

      const handleDecline = async () => {
        try {
          await fetchUpdateWithDrawStatus({ id, status: "declined" })
          console.log(`❌ Відхилено ${id}`)
        } catch (error) {
          console.error("❌ Помилка при відхиленні:", error)
        }
      }

      return (
        <div className="flex gap-2">
          <Button size="sm" className="bg-green-600" onClick={handleApprove}>
            Погодити
          </Button>
          <Button size="sm" className="bg-red-600" onClick={handleDecline}>
            Відмінити
          </Button>
        </div>
      )
    },
  }),
]
