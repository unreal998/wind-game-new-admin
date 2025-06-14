"use client"
import { CopyButton } from "@/components/CopyButton"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"

type Transaction = {
  id: string
  created_at: string
  wallet: string
  summ: number
  uid: string
  txid: string
}

const columnHelper = createColumnHelper<Transaction>()

export const walletColumns: TableColumn<Transaction>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => {
      const id = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span className="font-medium">{id}</span>
          <CopyButton text={id} />
        </span>
      )
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Час створення",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
  }),
  columnHelper.accessor("wallet", {
    header: "Гаманець",
    cell: ({ getValue }) => {
      const value = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[160px] truncate">{value}</span>
          <CopyButton text={value} />
        </span>
      )
    },
  }),
  columnHelper.accessor("summ", {
    header: "Сума",
    cell: ({ getValue }) => getValue().toFixed(2),
  }),
  columnHelper.accessor("uid", {
    header: "UID",
    cell: ({ getValue }) => {
      const value = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span>{value}</span>
          <CopyButton text={value} />
        </span>
      )
    },
  }),
  columnHelper.accessor("txid", {
    header: "TXID",
    cell: ({ getValue }) => {
      const value = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[160px] truncate">{value}</span>
          <CopyButton text={value} />
        </span>
      )
    },
  }),
]
