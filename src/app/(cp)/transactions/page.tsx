"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn } from "@/types/table"
import {
  fetchTransactionsAllApi,
  fetchTransactionsApi,
  getUsersByIds,
} from "./_components/fetchTransactions"
import { walletColumns } from "./_components/WalletColumns"
import Sum from "@/components/Sum"
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker"
import { DateRange } from "react-day-picker"
import { interval, isWithinInterval } from "date-fns"
import NotAllowed from "@/components/NotAllowed"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import { Select, SelectItem, SelectContent, SelectGroup, SelectValue, SelectTrigger } from "@/components/Select"
import { AdminProfileTeams, adminProfileTeams } from "@/types/profile"
import { formatInTimeZone } from "date-fns-tz"

export default function WalletsAdminPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>()
  const [aggregatedValue] = useState<string | number | null>(null)
  const [sum, setSum] = useState<number>(0)
  const [clearSum, setClearSum] = useState<number>(0)
  const [selectedDateRangeSum, setSelectedDateRangeSum] = useState<number>(0)
  const [selectedDateRangeClearSum, setSelectedDateRangeClearSum] = useState<number>(0)
  const userRole = useUserStore(roleSelector)
  const [teamFilter, setTeamFilter] = useState<AdminProfileTeams | "all">("all")
  const [allTransactions, setAllTransactions] = useState<any[]>([])

  useEffect(() => {
    if (allTransactions.length === 0) return
    setSum(allTransactions.reduce((acc: number, next: any) => acc + next.summ, 0))
    setClearSum(
      allTransactions
        .filter((item: any) => item.txid !== "1w23uui8890bbh1y7u9it5r2cv2g" && item.txid !== "312r2r12f12r12f12fqwfh55h5h")
        .reduce((acc: number, next: any) => acc + next.summ, 0),
    )

    setSelectedDateRangeSum(
      filteredTransactions
        .filter((item: any) =>
          isWithinInterval(
            item.created_at,
            interval(
              formatInTimeZone(selectedDateRange?.to || new Date(), 'Europe/Kiev', "yyyy-MM-dd HH:mm:ss"),
              formatInTimeZone(selectedDateRange?.from || new Date(), 'Europe/Kiev', "yyyy-MM-dd HH:mm:ss"),
            ),
          ),
        )
        .reduce((acc: number, next: any) => acc + next.summ, 0),
    )
    setSelectedDateRangeClearSum(
      filteredTransactions
        .filter((item: any) => item.txid !== "1w23uui8890bbh1y7u9it5r2cv2g" && item.txid !== "312r2r12f12r12f12fqwfh55h5h")
        .filter((item: any) =>
          isWithinInterval(
            item.created_at,
            interval(
              formatInTimeZone(selectedDateRange?.to || new Date(), 'Europe/Kiev', "yyyy-MM-dd HH:mm:ss"),
              formatInTimeZone(selectedDateRange?.from || new Date(), 'Europe/Kiev', "yyyy-MM-dd HH:mm:ss"),
            ),
          ),
        )
        .reduce((acc: number, next: any) => acc + next.summ, 0),
    )
  }, [filteredTransactions, selectedDateRange, allTransactions])

  const filterableColumns: FilterableColumn[] = [
    { id: "id", title: "ID", type: "text" },
    { id: "created_at", title: "Creation time", type: "dateRange" },
    { id: "wallet", title: "Wallet", type: "text" },
    { id: "summ", title: "Sum", type: "number" },
    { id: "uid", title: "UID", type: "text" },
    { id: "txid", title: "TXID", type: "text" },
    { id: "invitedBy", title: "Запросив", type: "text" },
  ]

  useEffect(() => {
    if (!selectedDateRange) return
    const loadTransactions = async (selectedDateRange: DateRange) => {
      try {
        setIsLoading(true)
        const data = await fetchTransactionsApi(selectedDateRange)
        console.log(JSON.stringify(data))
        const userIds: string[] = data.map((item: any) => item.uid)
        const uniqueUserIds = Array.from(new Set(userIds))
        const usersData = await getUsersByIds(uniqueUserIds)
        const transactionsData = data.map((item: any) => {
          const user = usersData.find((user: any) => user.id === item.uid)
          if (user === undefined) return item
          return {
            ...item,
            invitedBy: user?.invitedBy || "",
            telegramID: user?.telegramID ?? "",
            userName: user?.userName ?? "",
            team: user?.team ?? "",
          }
        })
        setTransactions(transactionsData)
      } catch (error) {
        console.error("Помилка при отриманні транзакцій:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions(selectedDateRange)
  }, [setTransactions, selectedDateRange])

  useEffect(() => {
    const fetchAllTransactions = async () => {
      const data = await fetchTransactionsAllApi()
      setAllTransactions(data)
    }
    fetchAllTransactions()
  }, [])

  useEffect(() => {
    if (transactions.length === 0) return
    if (teamFilter !== "all") {
      setFilteredTransactions(transactions.filter((transaction) => transaction.team === teamFilter))
    } else {
      setFilteredTransactions(transactions)
    }
  }, [teamFilter, transactions])

  if (userRole === "marketing") return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Поповнення TON</h1>
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

        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <div className="flex gap-10">
        <Sum
            label="Сума за період"
            sum={selectedDateRangeSum}
          />
        <Sum label="Загальна сума" sum={sum} />
        <Sum label="Сума чиста" sum={clearSum} />
        <Sum label="Чиста сума за період " sum={selectedDateRangeClearSum} />
      </div>

      <Card className="p-0">
        <DataTable
          data={filteredTransactions}
          columns={walletColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
