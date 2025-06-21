"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { TRANSACTION_STATUSES } from "@/components/data-table/constants"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import { useEffect, useRef, useState } from "react"
import { withdrawalColumns } from "./_components/WithdrawalColumns"
import { fetchWithdrawalsApi } from "./_components/fetchWithdrawal"
import { useAdminReferralsStore } from "@/stores/admin/useAdminReferralsStore"
import { WithdrawalsDateFilter } from "./_components/WithdrawalsDateFilter"
import { RangeDatePickerRef } from "@/components/DatePicker"
import Sum from "@/components/Sum"

export default function WithdrawalAdminPage() {
  const rangeRef = useRef<RangeDatePickerRef>(null)

  const [aggregatedValue] = useState<string | number | null>(null)
  const { profiles, isLoading } = useAdminReferralsStore()
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [isWithdrawalsLoading, setIsWithdrawalsLoading] = useState(false)
  const [sum, setSum] = useState<number>(0)

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
        setIsWithdrawalsLoading(true)
        const withdrawalsData = await fetchWithdrawalsApi()
        setWithdrawals(
          withdrawalsData.map((withdrawal: any) => {
            const user = profiles.find((user) => {
              if (withdrawal.uid === user.id) {
                return user
              }
              return
            })
            if (user) {
              const withdrawalWithInviter = {
                ...withdrawal,
                inviter: user.invitedBy,
              }
              return withdrawalWithInviter
            }
            return withdrawal
          }),
        )

        setSum(
          withdrawalsData.reduce((acc: number, next: any) => acc + next.sum, 0),
        )
      } catch (error) {
        console.error("Помилка при отриманні транзакцій:", error)
      } finally {
        setIsWithdrawalsLoading(false)
      }
    }

    loadWithdrawls()
  }, [profiles])

  useEffect(() => {
    const select = rangeRef.current?.getValue()
    console.log("select?.to", select?.to)
    console.log("select?.from", select?.from)
  }, [rangeRef.current?.getValue()?.from])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Вивід</h1>
        <WithdrawalsDateFilter rangeRef={rangeRef} />
        <Sum label="Загальна сумма" sum={sum} />

        {!isLoading && !isWithdrawalsLoading && aggregatedValue && (
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
          isLoading={isLoading && isWithdrawalsLoading}
        />
      </Card>
    </>
  )
}
