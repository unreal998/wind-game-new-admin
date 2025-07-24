// MissionColumns.ts
"use client"

import { CopyButton } from "@/components/CopyButton"
import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import MissionActionsCell from "./MissionActionsCell"
import type { Mission } from "./fetchMissions"
import { Checkbox } from "@/components/Checkbox"

const columnHelper = createColumnHelper<Mission>()

export const getMissionColumns = (
  lang: "ru" | "en",
  isAvialableToWrite: boolean,
): TableColumn<Mission>[] => {
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
    columnHelper.accessor("id", {
      header: "ID",
      cell: ({ getValue }) => {
        const id = getValue()
        return (
          <span className="flex items-center space-x-2">
            <span className="font-medium">{id}</span>
            <CopyButton text={String(id)} />
          </span>
        )
      },
    }),
    columnHelper.accessor("img", {
      header: "Зображення",
      cell: ({ getValue }) => {
        const imgUrl = getValue()
        return imgUrl ? (
          <img
            src={imgUrl}
            alt="Mission image"
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <span className="italic text-gray-400">Немає</span>
        )
      },
    }),
    columnHelper.accessor((row) => row.title[lang], {
      id: "title",
      header: "Заголовок",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.description[lang], {
      id: "description",
      header: "Опис",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("reward", {
      header: "Нагорода",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("coin", {
      header: "Коїн",
      cell: ({ getValue }) => {
        const coin = getValue()
        return coin === "TURX" ? "кВт" : coin
      },
    }),
    columnHelper.accessor("type", {
      header: "Тип",
      cell: ({ getValue }) => getValue(),
    }),
  ]
  if (isAvialableToWrite) {
    columns.push(
      columnHelper.display({
        id: "actions",
        header: "Команди",
        cell: ({ row, table }) => (
          <MissionActionsCell mission={row.original} table={table} />
        ),
      }),
    )
  }
  return columns
}
