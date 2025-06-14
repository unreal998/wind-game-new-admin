"use client"

import { Checkbox } from "@/components/Checkbox"
import { CopyButton } from "@/components/CopyButton"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type TableColumn } from "@/types/table"
import { type Wallet } from "@/types/wallet"
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
    header: "Creation time",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
  }),
  columnHelper.accessor("wallet", {
    header: "Wallet",
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
    header: "Sum",
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
