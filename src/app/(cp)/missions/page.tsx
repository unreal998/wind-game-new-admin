"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import { missionColumns } from "./_components/MissionColumns"
import { fetchMissions } from "./_components/fetchMissions"
import { Button } from "@/components"
import { CreateMissionModal } from "./_components/CreateMissionModal"

export default function MissionAdminPage() {
  const [missions, setMissions] = useState<any[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aggregatedValue] = useState<string | number | null>(null)

  const filterableColumns: FilterableColumn[] = [
    { id: "id", title: "ID", type: "text" },
    { id: "title", title: "Title", type: "text" },
    { id: "description", title: "Description", type: "text" },
    { id: "reward", title: "Reward", type: "number" },
    { id: "coin", title: "Coin", type: "text" },
    { id: "type", title: "Type", type: "text" },
  ]

  const loadMissions = async () => {
    try {
      setIsLoading(true)
      const data = await fetchMissions()
      setMissions(data)
      console.log("Отримані місії:", data)
    } catch (error) {
      console.error("Помилка при отриманні місій:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMissions()
  }, [])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Місії</h1>
        <div className="flex items-center gap-2">
          {!isLoading && aggregatedValue && (
            <Badge variant="indigo" className="px-3 py-1 text-base">
              {aggregatedValue}
            </Badge>
          )}
          <Button onClick={() => setIsCreateModalOpen(true)}>Додати</Button>
        </div>
      </div>

      <Card className="p-0">
        <DataTable
          data={missions}
          columns={missionColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
          onRefetch={loadMissions}
        />
      </Card>
      {isCreateModalOpen && (
        <CreateMissionModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  )
}
