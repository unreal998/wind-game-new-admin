"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type TableColumn } from "@/types/table"

type Withdrawal = {
  created_at: string
  wallet: string
  sum: number
  MEMO?: string
  status: string
}

const columnHelper = createColumnHelper<Withdrawal>()

export const withdrawalsColumns: TableColumn<Withdrawal>[] = [
  columnHelper.accessor("created_at", {
    header: "Час створення",
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue()).toLocaleString("uk-UA") : "-",
  }),
  columnHelper.accessor("wallet", {
    header: "Гаманець",
    cell: ({ getValue }) => getValue() ?? "-",
  }),
  columnHelper.accessor("sum", {
    header: "Сума",
    cell: ({ getValue }) => Number(getValue()) || 0,
  }),
  columnHelper.accessor("MEMO", {
    header: "Memo",
    cell: ({ getValue }) => getValue()?.trim() || "-",
  }),
  columnHelper.accessor("status", {
    header: "Статус",
    cell: ({ getValue }) => getValue() ?? "-",
  }),
]
