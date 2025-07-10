"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/Badge"
import { Button } from "@/components"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import { windModColumns } from "./_components/WindModColumns"
import WindsModModal from "./_components/WindsModModal"
import {
  CountryCodes,
  countryCodeToNameMap,
  useAdminWindModsStore,
} from "@/stores/admin/useAdminWindModsStore"
import { ModEditSidebar } from "./_components/ModEditSidebar"
import { WindMod } from "@/types/windMod"
import { fetchUserPermissions } from "@/stores/admin/useAdminReferralsStore"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import NotAllowed from "@/components/NotAllowed"

export default function WindModsAdminPage() {
  const [aggregatedValue] = useState<string | number | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAvialableToWrite, setIsAvialableToWrite] = useState<boolean>(false)
  const userRole = useUserStore(roleSelector)

  const {
    windMods,
    isLoading,
    activeWindMod,
    selectedCountry,
    setSelectedCountry,
  } = useAdminWindModsStore()

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await fetchUserPermissions()
        setIsAvialableToWrite(
          data.permissions.includes("write") &&
            (userRole === "admin" || userRole === "teamlead"),
        )
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }
    loadPermissions()
  }, [userRole])

  const countries: CountryCodes[] = ["nl", "dk", "gr", "usa"]

  const filterableColumns: FilterableColumn[] = [
    { id: "wind_speed", title: "Швидкість вітру", type: "number" },
    { id: "energy_per_hour", title: "Енергія за годину", type: "number" },
    { id: "price", title: "Ціна", type: "number" },
    { id: "required_pushes", title: "Необхідно пушів", type: "number" },
  ]

  if (!(userRole === "admin" || userRole === "teamlead")) return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Моди</h1>
        <div className="flex items-center gap-4">
          {countries.map((country) => (
            <Button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={
                selectedCountry === country
                  ? ""
                  : "border border-indigo-500 bg-transparent text-indigo-500 hover:bg-indigo-50"
              }
            >
              {countryCodeToNameMap[country]}
            </Button>
          ))}
        </div>
        {isAvialableToWrite && (
          <Button onClick={() => setIsModalOpen(true)}>Додати нову</Button>
        )}
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={
            windMods.find((mod) => mod.area === selectedCountry)?.values ??
            ([] as WindMod[])
          }
          columns={windModColumns(isAvialableToWrite)}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>

      {isModalOpen && <WindsModModal onClose={() => setIsModalOpen(false)} />}
      {activeWindMod && <ModEditSidebar />}
    </>
  )
}
