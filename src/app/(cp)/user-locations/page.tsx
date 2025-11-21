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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { AdminProfileTeams, adminProfileTeams, Locations, locations } from "@/types/profile"

export default function UserLocationsAdminPage() {
  const { userLocations, isLoading } = useAdminUserLocationsStore()
  const [aggregatedValue] = useState<string | number | null>(null)
  const [countries, setCountries] = useState<any[]>([])
  const userRole = useUserStore(roleSelector)
  const [filteredUserLocations, setFilteredUserLocations] = useState<UserLocation[]>([])
  const [teamFilter, setTeamFilter] = useState<AdminProfileTeams | "all">("all")
  const [locationFilter, setLocationFilter] = useState<Locations | "all">("all")


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
      id: "areaIncome",
      title: "Всього зароблено КВТ",
      type: "number",
    },
    {
      id: "areaIncomeTon",
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

  useEffect(() => {
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
            team: locationData.team || "Unknown",
          },
          location: {
            base_energy_per_hour: selectedCountire?.basicBonusPerClick || 0,
            percent_income: selectedCountire?.percent_income || 0,
          },
          location_id: area.name || "",
          last_push_at: area.lastButtonPress || "",
          boughtAt: area.boughtAt || null,
          areaIncome: Math.floor((area.areaIncome || 0) * 10000) / 10000,
          areaIncomeTon: Math.floor((area.areaIncomeTon || 0) * 1000) / 1000,
        } as UserLocation
        if ((teamFilter === "all" || userMod.user?.team === teamFilter) && (locationFilter === "all" || area.name === locationFilter)) {
          formatUserLocations.push(userMod as UserLocation)
        }
      })
    })
    setFilteredUserLocations(formatUserLocations)
  }, [userLocations, teamFilter, locationFilter, countries])

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
          <Select
              onValueChange={(value) =>
                setTeamFilter(value as AdminProfileTeams)
              }
              value={teamFilter}
        >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...adminProfileTeams, "all"].map((team) => (
                    <SelectItem key={team} value={team}>
                      {team === "all" ? "All Teams" : team.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
        </Select>
        <Select
              onValueChange={(value) =>
                setLocationFilter(value as Locations)
              }
              value={locationFilter}
        >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...locations, "all"].map((location) => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? "All" : location.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
        </Select>
      </div>

      <Card className="p-0">
        <DataTable
          data={filteredUserLocations}
          columns={userLocationColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
