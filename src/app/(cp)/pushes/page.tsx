"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminPushesStore } from "@/stores/admin/useAdminPushesStore"
import { LOCATION_TYPES } from "@/types/location"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { pushColumns } from "./_components/PushColumns"

export default function PushesAdminPage() {
  const { pushes, isLoading } = useAdminPushesStore()
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
      id: "location_id",
      title: "Локація",
      type: "select",
      options: LOCATION_TYPES,
    },
    {
      id: "coins_earned",
      title: "Зароблено ENRG",
      type: "number",
    },
    {
      id: "ton_earned",
      title: "Зароблено TON",
      type: "number",
    },
    {
      id: "started_at",
      title: "Початок",
      type: "dateRange",
    },
    // {
    //     id: "completed_at",
    //     title: "Завершення",
    //     type: "dateRange",
    // },
    {
      id: "status",
      title: "Статус",
      type: "boolean",
      options: [
        { value: "true", label: "Зібрано" },
        { value: "false", label: "Очікує" },
      ],
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Пуші</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={pushes}
          columns={pushColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
