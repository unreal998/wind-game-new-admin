"use client"

import { Checkbox } from "@/components/Checkbox"
import { CopyButton } from "@/components/CopyButton"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type TableColumn } from "@/types/table"
import { type Wallet } from "@/types/wallet"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper<Wallet>()

export const walletColumns: TableColumn<Wallet>[] = [
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

  columnHelper.accessor("address", {
    header: "Адреса гаманця",
    cell: ({ getValue }) => {
      const address = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{address}</span>
          <CopyButton text={address} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.address,
    },
  }),

  columnHelper.accessor((row) => row.user?.id, {
    id: "user.id",
    header: "ID користувача",
    cell: ({ getValue }) => {
      const id = getValue()
      if (!id) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="font-medium">{id}</span>
          <CopyButton text={String(id)} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => (row.user?.id ? String(row.user.id) : "-"),
    },
  }),

  columnHelper.accessor((row) => row.user?.username, {
    id: "user.username",
    header: "Username",
    cell: ({ getValue }) => {
      const username = getValue()
      if (!username) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span>{username}</span>
          <CopyButton text={username} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.user?.username || "-",
    },
  }),

  columnHelper.accessor("public_key", {
    header: "Публічний ключ",
    cell: ({ getValue }) => {
      const key = getValue()
      if (!key) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{key}</span>
          <CopyButton text={key} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.public_key || "-",
    },
  }),

  columnHelper.accessor("private_key", {
    header: "Приватний ключ",
    cell: ({ getValue }) => {
      const key = getValue()
      if (!key) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{key}</span>
          <CopyButton text={key} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.private_key || "-",
    },
  }),

  columnHelper.accessor("created_at", {
    header: "Дата створення",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) => formatTimestamp({ date: row.created_at }),
    },
  }),
]
