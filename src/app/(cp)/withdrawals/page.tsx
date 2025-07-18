"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { TRANSACTION_STATUSES } from "@/components/data-table/constants"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { getWithdrawalColumns } from "./_components/WithdrawalColumns"
import {
  fetchUserPermissions,
  useAdminReferralsStore,
} from "@/stores/admin/useAdminReferralsStore"
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker"
import { DateRange } from "react-day-picker"
import Sum from "@/components/Sum"
import { useAdminWithdrawalsStore } from "@/stores/admin/useAdminWithdrawalsStore"
import { roleSelector, useUserStore } from "@/stores/useUserStore"

export default function WithdrawalAdminPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>()

  const [aggregatedValue] = useState<string | number | null>(null)
  const [withdrawalsData, setWithdrawalsData] = useState<any[]>([])
  const [completedSum, setCompletedSum] = useState<number>(0)
  const [pendingSum, setPendingSum] = useState<number>(0)
  const [isAvialableToWrite, setIsAvialableToWrite] = useState<boolean>(false)
  const userRole = useUserStore(roleSelector)

  const { profiles, isLoading } = useAdminReferralsStore()
  const { withdrawals, isLoadingWithDrawal, fetchWithdrawals } =
    useAdminWithdrawalsStore()

  const filterableColumns: FilterableColumn[] = [
    {
      id: "processed_at",
      title: "Дата обробки",
      type: "dateRange",
    },
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
    const loadPermissions = async () => {
      try {
        const data = await fetchUserPermissions()
        setIsAvialableToWrite(
          data.permissions.includes("write") &&
            (userRole === "admin" || userRole === "teamlead"),
        )
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }
    loadPermissions()
  }, [userRole])

  useEffect(() => {
    fetchWithdrawals()
  }, [fetchWithdrawals])

  useEffect(() => {
    if (!withdrawals.length || !profiles.length) return
    setWithdrawalsData(
      withdrawals.map((withdrawal) => {
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
  }, [withdrawals, profiles])

  useEffect(() => {
    setCompletedSum(
      withdrawalsData.reduce((acc: number, next: any) => {
        return next.status === "completed" ? acc + next.sum : acc
      }, 0),
    )

    setPendingSum(
      withdrawalsData.reduce((acc: number, next: any) => {
        return next.status === "new" ? acc + next.sum : acc
      }, 0),
    )
  }, [withdrawalsData, selectedDateRange])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Вивід</h1>
        <EnhancedDatePicker setSelectedDateRange={setSelectedDateRange} />
        <Sum label="Сумма в очікуванні" sum={pendingSum} />
        <Sum label="Підтверджена сума" sum={completedSum} />

        {!isLoading && !isLoadingWithDrawal && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={withdrawalsData}
          columns={getWithdrawalColumns(isAvialableToWrite)}
          filterableColumns={filterableColumns}
          isLoading={isLoading && isLoadingWithDrawal}
          selectedDateRange={selectedDateRange}
        />
      </Card>
    </>
  )
}
