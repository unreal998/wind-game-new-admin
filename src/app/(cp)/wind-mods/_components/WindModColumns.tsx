"use client"

import { Checkbox } from "@/components/Checkbox"
// import { DateWithDistance } from "@/components/data-table/DateWithDistance"
// import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type TableColumn } from "@/types/table"
import { type WindMod } from "@/types/windMod"
import { formatAmount } from "@/utils/amountFormatter"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper<WindMod>()

export const windModColumns: TableColumn<WindMod>[] = [
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

  columnHelper.accessor("wind_speed", {
    header: "Швидкість вітру",
    cell: ({ getValue }) => `${getValue()} м/с`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Швидкість вітру (м/с)",
      exportValue: (row) => row.wind_speed || 0,
      exportAlign: "right",
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

  // columnHelper.accessor("created_at", {
  //     header: "Дата створення",
  //     cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
  //     enableSorting: true,
  //     filterFn: "dateRange",
  //     meta: {
  //         exportValue: (row) => formatTimestamp({ date: row.created_at }),
  //     },
  // }),
]
