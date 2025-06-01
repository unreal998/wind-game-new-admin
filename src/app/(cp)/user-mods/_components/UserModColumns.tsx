"use client"

import { Badge } from "@/components/Badge"
import { Checkbox } from "@/components/Checkbox"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { LOCATION_TYPES } from "@/types/location"
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
    header: "ID користувача",
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

  columnHelper.accessor("location_id", {
    header: "Локація",
    cell: ({ getValue }) => {
      const type = getValue()
      return LOCATION_TYPES.find((t) => t.value === type)?.label || type
    },
    enableSorting: true,
    filterFn: "select",
    meta: {
      exportValue: (row) =>
        LOCATION_TYPES.find((t) => t.value === row.location_id)?.label ||
        row.location_id,
    },
  }),

  columnHelper.accessor("is_active", {
    header: "Статус",
    cell: ({ getValue }) => {
      const isActive = getValue()
      return (
        <Badge
          variant={isActive ? "success" : "neutral"}
          className="px-2 py-0.5"
        >
          {isActive ? "Активний" : "Неактивний"}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: "equals",
    meta: {
      exportValue: (row) => (row.is_active ? "Активний" : "Неактивний"),
    },
  }),

  columnHelper.accessor("energy_per_hour", {
    header: "Енергія за годину",
    cell: ({ getValue }) => `${getValue()} ENRG`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Енергія за годину (ENRG)",
      exportValue: (row) => row.energy_per_hour || 0,
      exportAlign: "right",
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

  columnHelper.accessor((row) => row.price * row.profit_multiplier, {
    id: "final_profit",
    header: "Фінальний прибуток",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Фінальний прибуток (TON)",
      exportValue: (row) => row.price * row.profit_multiplier || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("required_pushes", {
    header: "Необхідно пушів",
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
    header: "Зароблено ENRG",
    cell: ({ getValue }) => `${getValue()} ENRG`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Зароблено (ENRG)",
      exportValue: (row) => row.coins_earned || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("ton_earned", {
    header: "Зароблено TON",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Зароблено (TON)",
      exportValue: (row) => row.ton_earned || 0,
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
