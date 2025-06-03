"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminLocationsStore } from "@/stores/admin/useAdminLocationsStore"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { locationColumns } from "./_components/LocationColumns"

export default function LocationsAdminPage() {
  const { locations, isLoading } = useAdminLocationsStore()
  const [aggregatedValue] = useState<string | number | null>(null)

  const filterableColumns: FilterableColumn[] = [
    {
      id: "title",
      title: "Локація",
      type: "text",
    },
    {
      id: "basicBonusPerClick",
      title: "Базова енергія за клік",
      type: "number",
    },
    {
      id: "referalsToUnlock",
      title: "Необхідно рефералів",
      type: "number",
    },
    {
      id: "unlockPrice",
      title: "Ціна розблокування",
      type: "number",
    },
  ]
  console.log("LocationsAdminPage locations:", locations)
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
