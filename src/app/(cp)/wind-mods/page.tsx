"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminWindModsStore } from "@/stores/admin/useAdminWindModsStore"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { windModColumns } from "./_components/WindModColumns"

export default function WindModsAdminPage() {
  const { windMods, isLoading } = useAdminWindModsStore()
  const [aggregatedValue] = useState<string | number | null>(null)

  const filterableColumns: FilterableColumn[] = [
    {
      id: "wind_speed",
      title: "Швидкість вітру",
      type: "number",
    },
    {
      id: "energy_per_hour",
      title: "Енергія за годину",
      type: "number",
    },
    {
      id: "price",
      title: "Ціна",
      type: "number",
    },
    {
      id: "required_pushes",
      title: "Необхідно пушів",
      type: "number",
    },
    // {
    //     id: "created_at",
    //     title: "Дата створення",
    //     type: "dateRange",
    // },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Моди</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={windMods}
          columns={windModColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
