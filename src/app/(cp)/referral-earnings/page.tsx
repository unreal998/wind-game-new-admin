"use client"
import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminReferralEarningsStore } from "@/stores/admin/useAdminReferralEarningsStore"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { referralEarningColumns } from "./_components/ReferralEarningColumns"
import { WithdrawalsDateFilter } from "../withdrawals/_components/WithdrawalsDateFilter"
import { DateRange } from "react-day-picker"
import Sum from "@/components/Sum"
import { useAdminReferralsStore } from "@/stores/admin/useAdminReferralsStore"
import { ReferralEarning } from "@/types/referralEarning"

export default function ReferralEarningsAdminPage() {
  const { referralEarnings, isLoading } = useAdminReferralEarningsStore()
  const { profiles } = useAdminReferralsStore()
  const [referalSum, setReferalSum] = useState<number>()
  const [referralEarningsData, setReferralEarningsData] =
    useState<ReferralEarning[]>()

  useEffect(() => {
    setReferalSum(referralEarnings.length)

    const earningsWithReferalCount = referralEarnings.map((earning) => {
      const referralUser = profiles.find(
        (u) => Number(u.telegramID) === Number(earning.referral_user?.id),
      )
      const referalCount = profiles.filter(
        (anotherUser) => anotherUser.invitedBy === referralUser?.telegramID,
      ).length

      return {
        ...earning,
        referalCount:
          referralUser?.referalCount !== undefined
            ? referralUser.referalCount + referalCount
            : referalCount,
      }
    })

    setReferralEarningsData(earningsWithReferalCount)
  }, [profiles, referralEarnings])

  const [aggregatedValue] = useState<string | number | null>(null)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>()

  const filterableColumns: FilterableColumn[] = [
    {
      id: "user.id",
      title: "Telegram ID запрошувача",
      type: "text",
    },
    {
      id: "user.username",
      title: "Username запрошувача",
      type: "text",
    },
    {
      id: "referral_user.id",
      title: "Telegram ID реферала",
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
        <h1 className="mr-1 text-2xl font-semibold">Реферальні</h1>
        <WithdrawalsDateFilter setSelectedDateRange={setSelectedDateRange} />
        <Sum label="Загальна кількість рефералів" sum={referalSum ?? 0} />
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          selectedDateRange={selectedDateRange}
          data={referralEarningsData ?? referralEarnings}
          columns={referralEarningColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
