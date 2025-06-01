"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminUserModsStore } from "@/stores/admin/useAdminUserModsStore"
import { LOCATION_TYPES } from "@/types/location"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { userModColumns } from "./_components/UserModColumns"

export default function UserModsAdminPage() {
  const { userMods, isLoading } = useAdminUserModsStore()
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
      id: "is_active",
      title: "Статус",
      type: "select",
      options: [
        { value: "true", label: "Активний" },
        { value: "false", label: "Неактивний" },
      ],
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
      id: "purchased_at",
      title: "Дата покупки",
      type: "dateRange",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Моди придбані</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={userMods}
          columns={userModColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
