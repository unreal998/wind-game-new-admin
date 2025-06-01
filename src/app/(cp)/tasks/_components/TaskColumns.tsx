"use client"

import { Badge } from "@/components/Badge"
import { Checkbox } from "@/components/Checkbox"
import { CopyButton } from "@/components/CopyButton"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type TableColumn } from "@/types/table"
import { TASK_TYPES, type Task } from "@/types/task"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper<Task>()

export const taskColumns: TableColumn<Task>[] = [
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

  columnHelper.accessor("type", {
    header: "Тип",
    cell: ({ getValue }) => {
      const type = getValue()
      return (
        <Badge variant="indigo" className="px-2 py-0.5">
          {TASK_TYPES.find((t) => t.value === type)?.label || type}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: "select",
    meta: {
      exportValue: (row) =>
        TASK_TYPES.find((t) => t.value === row.type)?.label || row.type,
    },
  }),

  columnHelper.accessor("title", {
    header: "Назва",
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.title,
    },
  }),

  columnHelper.accessor("url", {
    header: "URL",
    cell: ({ getValue }) => {
      const url = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[200px] truncate">{url}</span>
          <CopyButton text={url} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.url,
    },
  }),

  columnHelper.accessor("reward", {
    header: "Винагорода",
    cell: ({ getValue }) => `${getValue()} ENRG`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Винагорода (ENRG)",
      exportValue: (row) => row.reward || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("created_at", {
    header: "Дата створення",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) => formatTimestamp({ date: row.created_at }),
    },
  }),
]
