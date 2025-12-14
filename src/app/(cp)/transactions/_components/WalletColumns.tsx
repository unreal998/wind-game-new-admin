"use client"
import { Checkbox } from "@/components/Checkbox"
import { CopyButton } from "@/components/CopyButton"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"

type Transaction = {
  id: string
  created_at: string
  wallet: string
  summ: number
  telegramID: string
  txid: string
  invitedBy: string
  userName: string
  team: string
}

const columnHelper = createColumnHelper<Transaction>()

export const walletColumns: TableColumn<Transaction>[] = [
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
          <CopyButton text={id} />
        </span>
      )
    },
    meta: {
      exportValue: (row) => row.id || "-",
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Час створення",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    meta: {
      exportValue: (row) => formatTimestamp({ date: row.created_at }),
    },
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
    meta: {
      exportValue: (row) => row.wallet || "-",
    },
  }),
  columnHelper.accessor("summ", {
    header: "Сума",
    cell: ({ getValue }) => getValue().toFixed(2),
    meta: {
      exportValue: (row) => row.summ.toFixed(2) || "-",
    },
  }),
  columnHelper.accessor("userName", {
    header: "Ім'я користувача",
    cell: ({ getValue }) => {
      const userName = getValue()
      if (!userName) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span>{userName}</span>
          <CopyButton text={userName} />
        </span>
      )
    },
    meta: {
      exportValue: (row) => row.userName || "-",
    },
  }),
  columnHelper.accessor("telegramID", {
    header: "Телеграм ID",
    cell: ({ getValue }) => {
      const tid = getValue()
      if (!tid) "-"
      return (
        <span className="flex items-center space-x-2">
          <span>{tid}</span>
          <CopyButton text={tid} />
        </span>
      )
    },
    meta: {
      exportValue: (row) => row.telegramID || "-",
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
    meta: {
      exportValue: (row) => row.txid || "-",
    },
  }),
  columnHelper.accessor("team", {
    header: "Команда",
    cell: ({ getValue }) => {
      const value = getValue()
      return <span className="max-w-[160px] truncate">{value}</span>
    },
    meta: {
      exportValue: (row) => row.team || "-",
    },
  }),
  columnHelper.accessor("invitedBy", {
    header: "Запросив",
    cell: ({ getValue }) => {
      const value = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[160px] truncate">{value}</span>
          <CopyButton text={value} />
        </span>
      )
    },
    meta: {
      exportValue: (row) => row.invitedBy || "-",
    },
  }),
]
