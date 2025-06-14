"use client"

import { formatTimestamp } from "@/hooks/formatTimestamp"
import { createColumnHelper } from "@tanstack/react-table"
import { type TableColumn } from "@/types/table"

type Transaction = {
  id: string
  created_at: string
  summ: number
}

const columnHelper = createColumnHelper<Transaction>()

export const transactionColumns: TableColumn<Transaction>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: "Час створення",
    cell: ({ getValue }) => formatTimestamp({ date: getValue() }),
  }),
  columnHelper.accessor("summ", {
    header: "Сума",
    cell: ({ getValue }) => `${getValue().toFixed(2)} TON`,
  }),
]
