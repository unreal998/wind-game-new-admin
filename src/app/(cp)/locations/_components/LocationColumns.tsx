"use client"

import { Checkbox } from "@/components/Checkbox"
// import { DateWithDistance } from "@/components/data-table/DateWithDistance"
// import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type Location } from "@/types/location"
import { type TableColumn } from "@/types/table"
import { formatAmount } from "@/utils/amountFormatter"
import { createColumnHelper } from "@tanstack/react-table"
import LocationActionsCell from "./LocationActionsCell"

const columnHelper = createColumnHelper<Location>()

export const locationColumns = (
  isAvialableToWrite: boolean
): TableColumn<Location>[] => {
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

    columnHelper.accessor("title", {
      header: "Локація",
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      filterFn: "text",
      meta: {
        exportHeader: "Локація",
        exportValue: (row) => row.title || 0,
        exportAlign: "right",
      },
    }),

    columnHelper.accessor("basicBonusPerClick", {
      header: "Базова енергія за клік",
      cell: ({ getValue }) => `${getValue()} квт`,
      enableSorting: true,
      filterFn: "number",
      meta: {
        exportHeader: "Базова енергія за клік (квт)",
        exportValue: (row) => row.basicBonusPerClick || 0,
        exportAlign: "right",
      },
    }),

    columnHelper.accessor("referalsToUnlock", {
      header: "Необхідно рефералів",
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      filterFn: "number",
      meta: {
        exportValue: (row) => row.referalsToUnlock || 0,
        exportAlign: "right",
      },
    }),

    columnHelper.accessor("unlockPrice", {
      header: "Ціна розблокування",
      cell: ({ getValue }) => formatAmount(getValue()),
      enableSorting: true,
      filterFn: "number",
      meta: {
        exportHeader: "Ціна розблокування (TON)",
        exportValue: (row) => row.unlockPrice || 0,
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
    if (isAvialableToWrite) {
      columns.push(columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }: any) => (
          <LocationActionsCell location={row.original} />
        ),
        enableSorting: false,
        enableHiding: false,
      }))
    }
  return columns;
}
