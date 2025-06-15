"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/Badge"
import { Button } from "@/components"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import { windModColumns } from "./_components/WindModColumns"
import { fetchMods } from "./_components/fetchMods"
import WindsModModal from "./_components/WindsModModal"

export default function WindModsAdminPage() {
  const [aggregatedValue] = useState<string | number | null>(null)
  const [activeCountry, setActiveCountry] = useState<string>("Нідерланди")
  const [isLoading, setIsLoading] = useState(false)
  const [mods, setMods] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const countries = ["Нідерланди", "Данія", "Німеччина", "США"]
  const countryCodeMap: Record<string, string> = {
    Нідерланди: "nl",
    Данія: "dk",
    Німеччина: "gr",
    США: "usa",
  }

  const filterableColumns: FilterableColumn[] = [
    { id: "wind_speed", title: "Швидкість вітру", type: "number" },
    { id: "energy_per_hour", title: "Енергія за годину", type: "number" },
    { id: "price", title: "Ціна", type: "number" },
    { id: "required_pushes", title: "Необхідно пушів", type: "number" },
  ]

  useEffect(() => {
    const loadMods = async () => {
      try {
        setIsLoading(true)
        const code = countryCodeMap[activeCountry]
        const result = await fetchMods(code)
        console.log("Результат для:", code, result)
        setMods(result)
      } catch (error) {
        console.error("Помилка при отриманні модів:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMods()
  }, [activeCountry])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Моди</h1>
        <div className="flex items-center gap-4">
          {countries.map((country) => (
            <Button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={
                activeCountry === country
                  ? ""
                  : "border border-indigo-500 bg-transparent text-indigo-500 hover:bg-indigo-50"
              }
            >
              {country}
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
          data={mods}
          columns={windModColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>

      {isModalOpen && <WindsModModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
