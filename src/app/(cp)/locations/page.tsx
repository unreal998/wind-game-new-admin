"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminLocationsStore } from "@/stores/admin/useAdminLocationsStore"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { locationColumns } from "./_components/LocationColumns"
import { LocationEditSidebar } from "./_components/LocationEditSidebar"
import { fetchUserPermissions } from "@/stores/admin/useAdminReferralsStore"

export default function LocationsAdminPage() {
  const { locations, isLoading } = useAdminLocationsStore()
  const [aggregatedValue] = useState<string | number | null>(null)
  const { activeLocation } = useAdminLocationsStore()
  const [isAvialableToWrite, setIsAvialableToWrite] = useState<boolean>(false);

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

  useEffect(() => {
      const loadPermissions = async () => {
        try {
          const data = await fetchUserPermissions()
          setIsAvialableToWrite(data.permissions.includes('write'))
        } catch (error) {
          console.error("Failed to fetch withdrawals", error)
        }
      }  
      loadPermissions()
    }, [])

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
          columns={locationColumns(isAvialableToWrite)}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
      {activeLocation && <LocationEditSidebar />}

    </>
  )
}
