"use client"

import { Checkbox } from "@/components/Checkbox"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
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

  columnHelper.accessor((row) => row.location?.base_energy_per_hour, {
    id: "location.base_energy_per_hour",
    header: "Базово кВт за клік",
    cell: ({ getValue }) => {
      const energy = getValue()
      if (!energy) return "-"
      return `${energy} кВт`
    },
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Базово квт за клік",
      exportValue: (row) => row.location?.base_energy_per_hour || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor((row) => row.location?.percent_income, {
    id: "location.percent_income",
    header: "%",
    cell: ({ getValue }) => {
      const energy = getValue()
      if (!energy) return "-"
      return `${energy}%`
    },
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "%",
      exportValue: (row) => row.location?.percent_income || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("areaIncome", {
    header: "Всього зароблено кВт",
    cell: ({ getValue }) => `${getValue() || 0} кВт`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Всього зароблено (КВТ)",
      exportValue: (row) => row.areaIncome || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("areaIncomeTon", {
    header: "Всього зароблено TON",
    cell: ({ getValue }) => formatAmount(getValue() || 0),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Всього зароблено (TON)",
      exportValue: (row) => row.areaIncomeTon || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("boughtAt", {
    header: "Дата розблокування",
    cell: ({ getValue }) => {
      return <DateWithDistance date={getValue() ?? ""} />
    },
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) =>
        formatTimestamp({
          date: row.boughtAt as any,
        }),
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
