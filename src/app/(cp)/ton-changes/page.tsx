"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import { getTonChangesColumns } from "./_components/TonChangesColumns"
import { getTonChanges, TonChange } from "./_components/fetchTonChanges"
import { useUserStore, roleSelector } from "@/stores/useUserStore"
import NotAllowed from "@/components/NotAllowed"

export default function TonChangesPage() {
  const [tonChanges, setTonChanges] = useState<TonChange[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const userRole = useUserStore(roleSelector)

  const filterableColumns: FilterableColumn[] = [
    { id: "id", title: "ID", type: "text" },
    { id: "uid", title: "User ID", type: "text" },
    { id: "tid", title: "Telegram ID", type: "number" },
    { id: "sum", title: "Sum", type: "number" },
    { id: "source", title: "Source", type: "text" },
  ]

  const loadTonChanges = async () => {
    try {
      setIsLoading(true)
      const data = await getTonChanges()
      setTonChanges(data)
    } catch (error) {
      console.error("Error fetching TON changes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTonChanges()
  }, [])

  if (!(userRole === "admin" || userRole === "teamlead")) return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">TON Нарахування</h1>
      </div>

      <Card className="p-0">
        <DataTable
          data={tonChanges ?? []}
          columns={getTonChangesColumns()}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
          onRefetch={loadTonChanges}
        />
      </Card>
    </>
  )
}
