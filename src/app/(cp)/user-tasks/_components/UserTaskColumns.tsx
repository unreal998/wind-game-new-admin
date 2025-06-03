"use client"

import { Badge } from "@/components/Badge"
import { Checkbox } from "@/components/Checkbox"
import { CopyButton } from "@/components/CopyButton"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type TableColumn } from "@/types/table"
import { TASK_TYPES } from "@/types/task"
import { TASK_COMPLETION_STATUSES, type UserTask } from "@/types/userTask"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper<UserTask>()

export const userTaskColumns: TableColumn<UserTask>[] = [
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

  columnHelper.accessor((row) => row.user?.id, {
    id: "user.id",
    header: "ID користувача",
    cell: ({ getValue }) => {
      const id = getValue()
      if (!id) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="font-medium">{id}</span>
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => (row.user?.id ? String(row.user.id) : "-"),
    },
  }),

  columnHelper.accessor((row) => row.user?.username, {
    id: "user.username",
    header: "Username",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.user?.username || "-",
    },
  }),

  columnHelper.accessor((row) => row.task?.type, {
    id: "task.type",
    header: "Тип завдання",
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
        TASK_TYPES.find((t) => t.value === row.task?.type)?.label ||
        row.task?.type ||
        "-",
    },
  }),

  columnHelper.accessor((row) => row.task?.title, {
    id: "task.title",
    header: "Назва завдання",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.task?.title.ru || "-",
    },
  }),

  columnHelper.accessor((row) => row.task?.url, {
    id: "task.url",
    header: "URL",
    cell: ({ getValue }) => {
      const url = getValue()
      if (!url) return "-"
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
      exportValue: (row) => row.task?.url || "-",
    },
  }),

  columnHelper.accessor((row) => row.task?.reward, {
    id: "task.reward",
    header: "Винагорода",
    cell: ({ getValue }) => `${getValue() || 0} ENRG`,
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "Винагорода (ENRG)",
      exportValue: (row) => row.task?.reward || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("status", {
    header: "Статус",
    cell: ({ getValue }) => {
      const status = getValue()
      const config = TASK_COMPLETION_STATUSES.find((s) => s.value === status)
      const variant =
        status === "completed"
          ? "success"
          : status === "failed"
            ? "error"
            : "neutral"
      return (
        <Badge variant={variant} className="px-2 py-0.5">
          {config?.label || status}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: "select",
    meta: {
      exportValue: (row) =>
        TASK_COMPLETION_STATUSES.find((s) => s.value === row.status)?.label ||
        row.status,
    },
  }),

  columnHelper.accessor("completion_deadline", {
    header: "Дедлайн",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) => formatTimestamp({ date: row.completion_deadline }),
    },
  }),

  columnHelper.accessor("completed_at", {
    header: "Дата виконання",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) =>
        row.completed_at ? formatTimestamp({ date: row.completed_at }) : "-",
    },
  }),
]
