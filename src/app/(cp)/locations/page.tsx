"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminLocationsStore } from "@/stores/admin/useAdminLocationsStore"
import { LOCATION_TYPES } from "@/types/location"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { locationColumns } from "./_components/LocationColumns"

export default function LocationsAdminPage() {
  const { locations, isLoading } = useAdminLocationsStore()
  const [aggregatedValue] = useState<string | number | null>(null)

  const filterableColumns: FilterableColumn[] = [
    {
      id: "id",
      title: "Локація",
      type: "select",
      options: LOCATION_TYPES,
    },
    {
      id: "base_wind_speed",
      title: "Базова швидкість вітру",
      type: "number",
    },
    {
      id: "base_energy_per_hour",
      title: "Базова енергія за годину",
      type: "number",
    },
    {
      id: "profit_multiplier",
      title: "Множник прибутку",
      type: "number",
    },
    {
      id: "required_referrals",
      title: "Необхідно рефералів",
      type: "number",
    },
    {
      id: "unlock_price",
      title: "Ціна розблокування",
      type: "number",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Локації</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={locations}
          columns={locationColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
