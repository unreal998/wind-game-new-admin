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
import NotAllowed from "@/components/NotAllowed"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { adminProfileTeams, AdminProfileTeams } from "@/types/profile"
import { interval, isWithinInterval } from "date-fns"

export default function WithdrawalAdminPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>()

  const [aggregatedValue] = useState<string | number | null>(null)
  const [withdrawalsData, setWithdrawalsData] = useState<any[]>([])
  const [filteredWithdrawalsData, setFilteredWithdrawalsData] = useState<any[]>([])
  const [completedSum, setCompletedSum] = useState<number>(0)
  const [pendingSum, setPendingSum] = useState<number>(0)
  const [isAvialableToWrite, setIsAvialableToWrite] = useState<boolean>(false)
  const userRole = useUserStore(roleSelector)
  const [selectedDateRangeClearSum, setSelectedDateRangeClearSum] = useState<number>(0)
  const [teamFilter, setTeamFilter] = useState<AdminProfileTeams | "all">("all")

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
          data.permissions.includes("write") && userRole === "admin",
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
            team: user.team,
          }
          return withdrawalWithInviter
        }
        return withdrawal
      }),
    )
  }, [withdrawals, profiles])

  useEffect(() => {
    const completedData = filteredWithdrawalsData.filter((item: any) => item.status === "completed")
    setCompletedSum(
      completedData.reduce((acc: number, next: any) => {
        return next.status === "completed" ? acc + next.sum : acc
      }, 0),
    )

    setPendingSum(
      filteredWithdrawalsData.reduce((acc: number, next: any) => {
        return next.status === "new" ? acc + next.sum : acc
      }, 0)
    )
    setSelectedDateRangeClearSum(
      completedData.filter((item: any) => isWithinInterval(
          item.created_at,
          interval(
            selectedDateRange?.to ?? new Date(),
            selectedDateRange?.from ?? new Date(),
          ),
        ),
      )
      .reduce((acc: number, next: any) => acc + next.sum, 0),
    )
  }, [withdrawalsData, selectedDateRange, filteredWithdrawalsData])

  useEffect(() => {
    if (withdrawalsData.length === 0) return
    if (teamFilter !== "all") {
      setFilteredWithdrawalsData(withdrawalsData.filter((withdrawal) => withdrawal.team === teamFilter))
    } else {
      setFilteredWithdrawalsData(withdrawalsData)
    }
  }, [teamFilter, withdrawalsData])

  if (userRole === "marketing") return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Вивід</h1>
        <EnhancedDatePicker setSelectedDateRange={setSelectedDateRange} />
        <Select
              onValueChange={(value) =>
                setTeamFilter(value as AdminProfileTeams)
              }
              value={teamFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...adminProfileTeams, "all"].map((team) => (
                    <SelectItem key={team} value={team}>
                      {team === "all" ? "All Teams" : team.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

        {!isLoading && !isLoadingWithDrawal && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>
      <div className="flex gap-10">
        <Sum label="В очікуванні" sum={pendingSum} />
        <Sum label="Підтверджена сума в обранному періоді" sum={selectedDateRangeClearSum} />
        <Sum label="Підтверджена сума" sum={completedSum} />
      </div>
      <Card className="p-0">
        <DataTable
          data={filteredWithdrawalsData}
          columns={getWithdrawalColumns(isAvialableToWrite)}
          filterableColumns={filterableColumns}
          isLoading={isLoading && isLoadingWithDrawal}
          selectedDateRange={selectedDateRange}
        />
      </Card>
    </>
  )
}
