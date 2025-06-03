"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminTasksStore } from "@/stores/admin/useAdminTasksStore"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { taskColumns } from "./_components/TaskColumns"

export default function TasksAdminPage() {
  const { tasks, isLoading } = useAdminTasksStore()
  const [aggregatedValue] = useState<string | number | null>(null)

  const filterableColumns: FilterableColumn[] = [
    {
      id: "type",
      title: "Тип",
      type: "text",
    },
    {
      id: "title",
      title: "Назва",
      type: "text",
    },
    {
      id: "description",
      title: "Опис",
      type: "text",
    },
    {
      id: "reward",
      title: "Винагорода",
      type: "number",
    },
    {
      id: "coin",
      title: "Монета",
      type: "text",
    },
    {
      id: "specType",
      title: "Специфічний тип",
      type: "text",
    },
    {
      id: "specValue",
      title: "Специфічне значення",
      type: "text",
    },
    {
      id: "created_at",
      title: "Дата створення",
      type: "dateRange",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Завдання</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={tasks}
          columns={taskColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
