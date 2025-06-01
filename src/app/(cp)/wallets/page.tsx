"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminWalletsStore } from "@/stores/admin/useAdminWalletsStore"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { walletColumns } from "./_components/WalletColumns"

export default function WalletsAdminPage() {
  const { wallets, isLoading } = useAdminWalletsStore()
  const [aggregatedValue] = useState<string | number | null>(null)

  const filterableColumns: FilterableColumn[] = [
    {
      id: "address",
      title: "Адреса гаманця",
      type: "text",
    },
    {
      id: "user.id",
      title: "ID користувача",
      type: "text",
    },
    {
      id: "user.username",
      title: "Username",
      type: "text",
    },
    {
      id: "public_key",
      title: "Публічний ключ",
      type: "text",
    },
    {
      id: "private_key",
      title: "Приватний ключ",
      type: "text",
    },
    {
      id: "created_at",
      title: "Дата створення",
      type: "dateRange",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Гаманці</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={wallets}
          columns={walletColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
