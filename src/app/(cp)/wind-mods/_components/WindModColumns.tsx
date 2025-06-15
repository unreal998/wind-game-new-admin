"use client"

import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import { formatAmount } from "@/utils/amountFormatter"
import { Checkbox } from "@/components/Checkbox"

type WindMod = {
  price: number
  tonValue: number
  turxValue: number
}

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
  columnHelper.display({
    id: "index",
    header: "№",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  }),
  // columnHelper.display({
  //   id: "wind_speed",
  //   header: "Швидкість вітру",
  //   cell: () => "",
  // }),
  columnHelper.accessor("turxValue", {
    header: "TURX дохід",
    cell: ({ getValue }) => `${getValue()}`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportValue: (row) => row.turxValue,
      exportAlign: "right",
    },
  }),
  columnHelper.accessor("tonValue", {
    header: "TON дохід",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportValue: (row) => row.tonValue,
      exportAlign: "right",
    },
  }),
]
