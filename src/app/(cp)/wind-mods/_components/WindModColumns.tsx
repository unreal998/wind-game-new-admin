"use client"

import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import { formatAmount } from "@/utils/amountFormatter"
import { Checkbox } from "@/components/Checkbox"
import ModActionsCell from "./ModActionsCell"
import { WindMod } from "@/types/windMod"

const columnHelper = createColumnHelper<WindMod>()

export const windModColumns= (
  isAvialableToWrite: boolean
): TableColumn<WindMod>[] => {
  let columns = [
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
      header: "кВт дохід",
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
    if (isAvialableToWrite) {
      columns.push(columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }: any) => <ModActionsCell mod={row.original} />,
        enableSorting: false,
        enableHiding: false,
      }))
    }
  return columns
}
