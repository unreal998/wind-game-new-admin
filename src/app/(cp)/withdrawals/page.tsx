"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { TRANSACTION_STATUSES } from "@/components/data-table/constants"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminTransactionsStore } from "@/stores/admin/useAdminTransactionsStore"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { withdrawalColumns } from "./_components/WithdrawalColumns"

export default function DepositsAdminPage() {
  const { isLoading, getFilteredTransactions } = useAdminTransactionsStore()
  const [aggregatedValue, setAggregatedValue] = useState<
    string | number | null
  >(null)

  const transactions = getFilteredTransactions(["withdrawal"])

  const filterableColumns: FilterableColumn[] = [
    // {
    //   id: "type",
    //   title: "Тип",
    //   type: "select",
    //   options: [
    //     { value: "deposit", label: "Поповнення" },
    //     { value: "withdrawal", label: "Вивід" },
    //   ],
    // },
    {
      id: "processed_at",
      title: "Дата обробки",
      type: "dateRange",
    },
    // {
    //   id: "created_at",
    //   title: "Дата створення",
    //   type: "dateRange",
    // },
    // {
    //   id: "processed_at",
    //   title: "Дата обробки",
    //   type: "dateRange",
    // },
    {
      id: "amount",
      title: "Зарахована сума",
      type: "number",
    },
    {
      id: "tx_amount",
      title: "Сума транзакції",
      type: "number",
    },
    // {
    //   id: "currency",
    //   title: "Валюта",
    //   type: "text",
    // },
    {
      id: "status",
      title: "Статус",
      type: "select",
      options: TRANSACTION_STATUSES,
    },
    {
      id: "from_address",
      title: "Адреса відправника",
      type: "text",
    },
    {
      id: "to_address",
      title: "Адреса отримувача",
      type: "text",
    },
    {
      id: "tx_id",
      title: "ID транзакції",
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
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Вивід</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={transactions}
          columns={withdrawalColumns}
          filterableColumns={filterableColumns}
          aggregations={[
            {
              columnId: "tx_amount",
              type: "sum",
              onResult: setAggregatedValue,
            },
          ]}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
