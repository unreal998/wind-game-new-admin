"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminReferralEarningsStore } from "@/stores/admin/useAdminReferralEarningsStore"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { referralEarningColumns } from "./_components/ReferralEarningColumns"

export default function ReferralEarningsAdminPage() {
  const { referralEarnings, isLoading } = useAdminReferralEarningsStore()
  const [aggregatedValue] = useState<string | number | null>(null)

  const filterableColumns: FilterableColumn[] = [
    {
      id: "user.id",
      title: "ID запрошувача",
      type: "text",
    },
    {
      id: "user.username",
      title: "Username запрошувача",
      type: "text",
    },
    {
      id: "referral_user.id",
      title: "ID реферала",
      type: "text",
    },
    {
      id: "referral_user.username",
      title: "Username реферала",
      type: "text",
    },
    {
      id: "amount",
      title: "Сума",
      type: "number",
    },
    {
      id: "created_at",
      title: "Дата",
      type: "dateRange",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Реферальні</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={referralEarnings}
          columns={referralEarningColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
