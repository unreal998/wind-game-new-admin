"use client"

import { CopyButton } from "@/components/CopyButton"
import { type TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import { fetchDeleteMission } from "./fetchMissions"
import { useState } from "react"

type Mission = {
  id: number
  img: string
  title: { en: string; ru: string }
  description: { en: string; ru: string }
  reward: number
  coin: string
  type: string
}

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
    cell: ({ row, table }) => {
      const mission = row.original
      const [isDeleting, setIsDeleting] = useState(false)

      const handleDelete = async () => {
        setIsDeleting(true)
        try {
          await fetchDeleteMission(mission.id)
          await table.options.meta?.onRefetch?.() // оновлення таблиці
        } catch (err) {
          console.error("Помилка при видаленні місії", err)
        } finally {
          setIsDeleting(false)
        }
      }

      return (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-80"
          style={{ minWidth: 80 }}
        >
          {isDeleting ? (
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          ) : (
            "Видалити"
          )}
        </button>
      )
    },
  }),
]
