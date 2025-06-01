"use client"

import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { ExportButton } from "@/components/data-table/ExportButton"
import { useAdminStatsStore } from "@/stores/admin/useAdminStatsStore"
import { statsColumns } from "./StatsColumns"

export function StatsTable() {
  const { stats, isLoading } = useAdminStatsStore()

  return (
    <div className="space-y-2">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h3 className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50">
          Баланс компанії
        </h3>
        <ExportButton data={stats} columns={statsColumns} filename="stats" />
      </div>

      <Card className="p-0">
        <DataTable
          data={stats}
          columns={statsColumns}
          simple={true}
          isLoading={isLoading}
        />
      </Card>
    </div>
  )
}
