"use client"

import { Checkbox } from "@/components/Checkbox"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { LOCATION_TYPES } from "@/types/location"
import { type TableColumn } from "@/types/table"
import { type UserLocation } from "@/types/userLocation"
import { formatAmount } from "@/utils/amountFormatter"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper<UserLocation>()

export const userLocationColumns: TableColumn<UserLocation>[] = [
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

  columnHelper.accessor((row) => row.location?.base_wind_speed, {
    id: "location.base_wind_speed",
    header: "Базова швидкість вітру",
    cell: ({ getValue }) => {
      const speed = getValue()
      if (!speed) return "-"
      return `${speed} м/с`
    },
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Базова швидкість вітру (м/с)",
      exportValue: (row) => row.location?.base_wind_speed || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor((row) => row.location?.base_energy_per_hour, {
    id: "location.base_energy_per_hour",
    header: "Базова енергія за годину",
    cell: ({ getValue }) => {
      const energy = getValue()
      if (!energy) return "-"
      return `${energy} ENRG`
    },
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Базова енергія за годину (ENRG)",
      exportValue: (row) => row.location?.base_energy_per_hour || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor((row) => row.location?.profit_multiplier, {
    id: "location.profit_multiplier",
    header: "Множник прибутку",
    cell: ({ getValue }) => {
      const multiplier = getValue()
      if (!multiplier) return "-"
      return `${multiplier}x`
    },
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Множник прибутку",
      exportValue: (row) => row.location?.profit_multiplier || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("total_coins_earned", {
    header: "Всього зароблено ENRG",
    cell: ({ getValue }) => `${getValue() || 0} ENRG`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Всього зароблено (ENRG)",
      exportValue: (row) => row.total_coins_earned || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("total_ton_earned", {
    header: "Всього зароблено TON",
    cell: ({ getValue }) => formatAmount(getValue() || 0),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Всього зароблено (TON)",
      exportValue: (row) => row.total_ton_earned || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("unlocked_at", {
    header: "Дата розблокування",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) => formatTimestamp({ date: row.unlocked_at }),
    },
  }),

  columnHelper.accessor("last_push_at", {
    header: "Останній пуш",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) => formatTimestamp({ date: row.last_push_at }),
    },
  }),
]
