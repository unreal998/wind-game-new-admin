"use client"
import { CopyButton } from "@/components/CopyButton"
import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import MissionActionsCell from "./MissionActionsCell"
import type { Mission } from "./fetchMissions"

const columnHelper = createColumnHelper<Mission>()

export const missionColumns: TableColumn<Mission>[] = [
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
  columnHelper.accessor((row) => row.title.en, {
    id: "title",
    header: "Заголовок",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.description.en, {
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
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Тип",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Команди",
    cell: ({ row, table }) => (
      <MissionActionsCell mission={row.original} table={table} />
    ),
  }),
]
