"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminUserLocationsStore } from "@/stores/admin/useAdminUserLocationsStore"
import { LOCATION_TYPES } from "@/types/location"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { userLocationColumns } from "./_components/UserLocationColumns"
import { UserLocation } from "@/types/userLocation"
import { createClient } from "@/utils/supabase/client"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import NotAllowed from "@/components/NotAllowed"

export default function UserLocationsAdminPage() {
  const { userLocations, isLoading } = useAdminUserLocationsStore()
  const [aggregatedValue] = useState<string | number | null>(null)
  const [countries, setCountries] = useState<any[]>([])
  const userRole = useUserStore(roleSelector)


  const filterableColumns: FilterableColumn[] = [
    {
      id: "user.telegramID",
      title: "Telegram ID користувача",
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
      title: "Всього зароблено КВТ",
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

  useEffect(() => {
    const fetchModsData = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("countries").select("*")
      if (error) {
        console.error(`ERROR FETCHING TURX BALANCE: ${error}`)
        return
      }

      setCountries(data || [])
    }
    fetchModsData()
  }, [])

  const formatUserLocations = [] as UserLocation[]
  userLocations.forEach((location: any) => {
    const locationData = location as any
    locationData.areas.forEach((area: any) => {
      const selectedCountire = countries.find((c) => c.shortName === area.name)
      const userMod = {
        user: {
          id: locationData.telegramID,
          username: locationData.userName || locationData.telegramID,
          first_name: locationData.firstName || "Unknown",
          last_name: locationData.lastName || "Unknown",
        },
        location: {
          base_energy_per_hour: selectedCountire?.basicBonusPerClick || 0,
        },
        location_id: area.name || "",
        last_push_at: area.lastButtonPress || "",
        boughtAt: area.boughtAt || null,
      } as UserLocation
      formatUserLocations.push(userMod as UserLocation)
    })
  })

  if (userRole === "marketing") return <NotAllowed />

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
          data={formatUserLocations}
          columns={userLocationColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
