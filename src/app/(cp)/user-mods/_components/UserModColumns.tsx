"use client"

import { Checkbox } from "@/components/Checkbox"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type TableColumn } from "@/types/table"
import { type UserMod } from "@/types/userMod"
import { formatAmount } from "@/utils/amountFormatter"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper<UserMod>()

export const userModColumns: TableColumn<UserMod>[] = [
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

  columnHelper.accessor((row) => row.user?.id, {
    id: "user.id",
    header: "Telegram ID",
    cell: ({ getValue }) => {
      const id = getValue()
      if (!id) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="font-medium">{id}</span>
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
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.user?.username || "-",
    },
  }),

  columnHelper.accessor((row) => row.user?.team, {

    header: "Команда",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.user?.team || "-",
    },
  }),
  columnHelper.accessor("location_id", {
    header: "Локація",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.locationName || "-",
    },
  }),

  columnHelper.accessor("price", {
    header: "Ціна",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Ціна (TON)",
      exportValue: (row) => row.price || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("required_pushes", {
    header: "Залишилось пушів",
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportValue: (row) => row.required_pushes || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("pushes_done", {
    header: "Виконано пушів",
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportValue: (row) => row.pushes_done || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("coins_earned", {
    header: "Зароблено кВт",
    cell: ({ getValue }) => `${getValue()} кВт`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Зароблено (КВТ)",
      exportValue: (row) => row.coins_earned || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("ton_earned", {
    header: "Зароблено TON",
    cell: ({ getValue }) => `${formatAmount(getValue())} TON`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Зароблено (TON)",
      exportValue: (row) => row.ton_earned || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("ton_remaining", {
    header: "Залишилось TON",
    cell: ({ getValue }) => `${formatAmount(getValue())} TON`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportValue: (row) => row.ton_remaining || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("coins_remaining", {
    header: "Залишилось кВт",
    cell: ({ getValue }) => `${getValue()} кВт`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportValue: (row) => row.coins_remaining || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("purchased_at", {
    header: "Дата покупки",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) => formatTimestamp({ date: row.purchased_at }),
    },
  }),
]
