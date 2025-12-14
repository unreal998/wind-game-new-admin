// MissionColumns.ts
"use client"

import { CopyButton } from "@/components/CopyButton"
import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import MissionActionsCell from "./MissionActionsCell"
import type { Mission } from "./fetchMissions"
import { Checkbox } from "@/components/Checkbox"
import { formatTimestamp } from "@/hooks/formatTimestamp"

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
      meta: {
        exportValue: (row) => row.id || "-",
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
      meta: {
        exportValue: (row) => row.img || "-",
      },
    }),
    columnHelper.accessor((row) => row.title[lang], {
      id: "title",
      header: "Заголовок",
      cell: (info) => info.getValue(),
      meta: {
        exportValue: (row) => row.title[lang] || "-",
      },
    }),
    columnHelper.accessor((row) => row.description[lang], {
      id: "description",
      header: "Опис",
      cell: (info) => info.getValue(),
      meta: {
        exportValue: (row) => row.description[lang] || "-",
      },
    }),
    columnHelper.accessor("reward", {
      header: "Нагорода",
      cell: ({ getValue }) => getValue(),
      meta: {
        exportValue: (row) => row.reward || "-",
      },
    }),
    columnHelper.accessor("coin", {
      header: "Коїн",
      cell: ({ getValue }) => {
        const coin = getValue()
        return coin === "TURX" ? "кВт" : coin
      },
      meta: {
        exportValue: (row) => row.coin || "-",
      },
    }),
    columnHelper.accessor("type", {
      header: "Тип",
      cell: ({ getValue }) => getValue(),
      meta: {
        exportValue: (row) => row.type || "-",
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Дата створення",
      cell: ({ getValue }) => new Date(getValue()).toLocaleString("uk-UA"),
      meta: {
        exportValue: (row) => formatTimestamp({ date: row.created_at }),
      },
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
