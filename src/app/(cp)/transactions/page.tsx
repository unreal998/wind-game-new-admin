"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import { fetchTransactionsApi } from "./_components/fetchTransactions"
import { walletColumns } from "./_components/WalletColumns"
import Sum from "@/components/Sum"

export default function WalletsAdminPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [aggregatedValue] = useState<string | number | null>(null)
  const [sum, setSum] = useState<number>(0)

  const filterableColumns: FilterableColumn[] = [
    { id: "id", title: "ID", type: "text" },
    { id: "created_at", title: "Creation time", type: "dateRange" },
    { id: "wallet", title: "Wallet", type: "text" },
    { id: "summ", title: "Sum", type: "number" },
    { id: "uid", title: "UID", type: "text" },
    { id: "txid", title: "TXID", type: "text" },
  ]

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true)
        const data = await fetchTransactionsApi()
        console.log("Fetched transactions:", data)
        setSum(data.reduce((acc: number, next: any) => acc + next.summ, 0))
        setTransactions(data)
      } catch (error) {
        console.error("Помилка при отриманні транзакцій:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Поповнення</h1>
        <Sum label="Загальна сумма" sum={sum} />

        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={transactions}
          columns={walletColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
