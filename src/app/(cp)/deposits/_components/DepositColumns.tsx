"use client"

import { Badge } from "@/components/Badge"
import { Checkbox } from "@/components/Checkbox"
import { CopyButton } from "@/components/CopyButton"
import { TRANSACTION_STATUSES } from "@/components/data-table/constants"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
// import { cx } from "@/lib/utils"
import { type TableColumn } from "@/types/table"
import { type Transaction } from "@/types/transaction"
import { formatAmount } from "@/utils/amountFormatter"
import { createColumnHelper } from "@tanstack/react-table"
// import { CirclePlus } from "lucide-react"

const columnHelper = createColumnHelper<Transaction>()

export const depositColumns: TableColumn<Transaction>[] = [
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

  // columnHelper.accessor("type", {
  //   header: "Тип",
  //   cell: ({ getValue }) => {
  //     const type = getValue()
  //     const typeConfig = {
  //       deposit: {
  //         label: "Поповнення",
  //         icon: CirclePlus,
  //         className: "text-green-600 dark:text-green-700",
  //       },
  //       withdrawal: {
  //         label: "Вивід",
  //         icon: CircleMinus,
  //         className: "text-red-600 dark:text-red-700",
  //       },
  //     } as const

  //     const config = typeConfig[type as keyof typeof typeConfig]
  //     if (!config) return type

  //     const Icon = config.icon
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Icon className={cx("size-4 shrink-0", config.className)} />
  //         <span>{config.label}</span>
  //       </div>
  //     )
  //   },
  //   enableSorting: true,
  //   filterFn: "select",
  // }),

  // columnHelper.accessor("created_at", {
  //   header: "Дата створення",
  //   cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
  //   enableSorting: true,
  //   filterFn: "dateRange",
  //   meta: {
  //     exportValue: (row) => formatTimestamp({ date: row.created_at }),
  //   },
  // }),

  columnHelper.accessor("processed_at", {
    header: "Дата обробки",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) => formatTimestamp({ date: row.processed_at }),
    },
  }),

  columnHelper.accessor("amount", {
    header: "Зарахована сума",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Зарахована сума (TON)",
      exportValue: (row) => row.amount || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("tx_amount", {
    header: "Сума транзакції",
    cell: ({ getValue }) => formatAmount(getValue() || 0),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Сума транзакції (TON)",
      exportValue: (row) => row.tx_amount || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("currency", {
    header: "Валюта",
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    filterFn: "text",
  }),

  columnHelper.accessor("status", {
    header: "Статус",
    cell: ({ getValue }) => {
      const status = getValue()
      const statusVariants = {
        pending: { label: "В обробці", variant: "neutral" },
        completed: { label: "Виконано", variant: "success" },
        failed: { label: "Помилка", variant: "error" },
        cancelled: { label: "Скасовано", variant: "warning" },
      } as const

      const statusInfo = statusVariants[status as keyof typeof statusVariants]
      return (
        <Badge variant={statusInfo?.variant || "neutral"}>
          {statusInfo?.label || status}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: "select",
    meta: {
      exportValue: (row) =>
        TRANSACTION_STATUSES.find((s) => s.value === row.status)?.label ||
        row.status,
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

  columnHelper.accessor("tx_id", {
    header: "ID транзакції",
    cell: ({ getValue }) => {
      const txId = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{txId}</span>
          <CopyButton text={txId} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.tx_id,
    },
  }),

  columnHelper.accessor("from_address", {
    header: "Адреса відправника",
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
      exportValue: (row) => row.from_address,
    },
  }),

  columnHelper.accessor("to_address", {
    header: "Адреса отримувача",
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
      exportValue: (row) => row.to_address,
    },
  }),
]
