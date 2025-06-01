"use client"

import { Checkbox } from "@/components/Checkbox"
// import { DateWithDistance } from "@/components/data-table/DateWithDistance"
// import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type Location, LOCATION_TYPES } from "@/types/location"
import { type TableColumn } from "@/types/table"
import { formatAmount } from "@/utils/amountFormatter"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper<Location>()

export const locationColumns: TableColumn<Location>[] = [
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
    header: "Локація",
    cell: ({ getValue }) => {
      const type = getValue()
      return LOCATION_TYPES.find((t) => t.value === type)?.label || type
    },
    enableSorting: true,
    filterFn: "select",
    meta: {
      exportValue: (row) =>
        LOCATION_TYPES.find((t) => t.value === row.id)?.label || row.id,
    },
  }),

  columnHelper.accessor("base_wind_speed", {
    header: "Базова швидкість вітру",
    cell: ({ getValue }) => `${getValue()} м/с`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Базова швидкість вітру (м/с)",
      exportValue: (row) => row.base_wind_speed || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("base_energy_per_hour", {
    header: "Базова енергія за годину",
    cell: ({ getValue }) => `${getValue()} ENRG`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Базова енергія за годину (ENRG)",
      exportValue: (row) => row.base_energy_per_hour || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("profit_multiplier", {
    header: "Множник прибутку",
    cell: ({ getValue }) => `${getValue()}x`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Множник прибутку",
      exportValue: (row) => row.profit_multiplier || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("required_referrals", {
    header: "Необхідно рефералів",
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportValue: (row) => row.required_referrals || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("unlock_price", {
    header: "Ціна розблокування",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Ціна розблокування (TON)",
      exportValue: (row) => row.unlock_price || 0,
      exportAlign: "right",
    },
  }),

  //   columnHelper.accessor("created_at", {
  //     header: "Дата створення",
  //     cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
  //     enableSorting: true,
  //     filterFn: "dateRange",
  //     meta: {
  //       exportValue: (row) => formatTimestamp({ date: row.created_at }),
  //     },
  //   }),
]
