"use client"

import { useState } from "react"
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

export default function WindModsAdminPage() {
  const [aggregatedValue] = useState<string | number | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    windMods,
    isLoading,
    activeWindMod,
    selectedCountry,
    setSelectedCountry,
  } = useAdminWindModsStore()

  const countries: CountryCodes[] = ["nl", "dk", "gr", "usa"]

  const filterableColumns: FilterableColumn[] = [
    { id: "wind_speed", title: "Швидкість вітру", type: "number" },
    { id: "energy_per_hour", title: "Енергія за годину", type: "number" },
    { id: "price", title: "Ціна", type: "number" },
    { id: "required_pushes", title: "Необхідно пушів", type: "number" },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Моди</h1>
        <button
          onClick={() => {
            console.log(
              windMods.find((mod) => mod.area === selectedCountry)?.values,
            )
          }}
        >
          fk
        </button>
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
        <Button onClick={() => setIsModalOpen(true)}>Додати нову</Button>
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
          columns={windModColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>

      {isModalOpen && <WindsModModal onClose={() => setIsModalOpen(false)} />}
      {activeWindMod && <ModEditSidebar />}
    </>
  )
}
