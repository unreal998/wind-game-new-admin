"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { TRANSACTION_STATUSES } from "@/components/data-table/constants"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { withdrawalColumns } from "./_components/WithdrawalColumns"
import { fetchWithdrawalsApi } from "./_components/fetchWithdrawal"

export default function WithdrawalAdminPage() {
  const [aggregatedValue] = useState<string | number | null>(null)
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    const loadWithdrawls = async () => {
      try {
        setIsLoading(true)
        const data = await fetchWithdrawalsApi()
        console.log("Fetched withdrawals:", data)
        setWithdrawals(data)
      } catch (error) {
        console.error("Помилка при отриманні транзакцій:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWithdrawls()
  }, [])

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
          data={withdrawals}
          columns={withdrawalColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
