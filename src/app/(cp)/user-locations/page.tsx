"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminUserLocationsStore } from "@/stores/admin/useAdminUserLocationsStore"
import { LOCATION_TYPES } from "@/types/location"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { userLocationColumns } from "./_components/UserLocationColumns"

export default function UserLocationsAdminPage() {
  const { userLocations, isLoading } = useAdminUserLocationsStore()
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
      id: "total_coins_earned",
      title: "Всього зароблено ENRG",
      type: "number",
    },
    {
      id: "total_ton_earned",
      title: "Всього зароблено TON",
      type: "number",
    },
    {
      id: "unlocked_at",
      title: "Дата розблокування",
      type: "dateRange",
    },
    {
      id: "last_push_at",
      title: "Останній пуш",
      type: "dateRange",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Локації користувачів</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={userLocations}
          columns={userLocationColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
