"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminUserTasksStore } from "@/stores/admin/useAdminUserTasksStore"
import { FilterableColumn } from "@/types/table"
import { TASK_TYPES } from "@/types/task"
import { TASK_COMPLETION_STATUSES } from "@/types/userTask"
import { useState } from "react"
import { userTaskColumns } from "./_components/UserTaskColumns"

export default function UserTasksAdminPage() {
  const { userTasks, isLoading } = useAdminUserTasksStore()
  const [aggregatedValue] = useState<string | number | null>(null)

  const filterableColumns: FilterableColumn[] = [
    {
      id: "user.id",
      title: "ID користувача",
      type: "text",
    },
    {
      id: "user.username",
      title: "Username",
      type: "text",
    },
    {
      id: "task.type",
      title: "Тип завдання",
      type: "select",
      options: TASK_TYPES,
    },
    {
      id: "task.title",
      title: "Назва завдання",
      type: "text",
    },
    {
      id: "task.reward",
      title: "Винагорода",
      type: "number",
    },
    {
      id: "status",
      title: "Статус",
      type: "select",
      options: TASK_COMPLETION_STATUSES,
    },
    {
      id: "completion_deadline",
      title: "Дедлайн",
      type: "dateRange",
    },
    {
      id: "completed_at",
      title: "Дата виконання",
      type: "dateRange",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Завдання виконані</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={userTasks}
          columns={userTaskColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
