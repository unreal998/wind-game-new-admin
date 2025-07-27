"use client"

import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import {
  fetchUserPermissions,
  useAdminReferralsStore,
} from "@/stores/admin/useAdminReferralsStore"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { userColumns } from "./_components/UserColumns"
import { UserSidebar } from "./_components/UserSidebar"
import { fetchWithdrawals } from "./_components/fetchWithdrawals"
import { withdrawalsColumns } from "./_components/withdrawalsColumns"
import Sum from "@/components/Sum"
import { AdminProfile } from "@/types/profile"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker"
import { DateRange } from "react-day-picker"
import { interval, isWithinInterval } from "date-fns"

export default function ReferralsAdminPage() {
  const { profiles, isLoading, updateUser } = useAdminReferralsStore()
  const userRole = useUserStore(roleSelector)
  const [activeUser, setActiveUser] = useState<any | null>(null)
  const [withdrawals, setWithdrawals] = useState<any[]>()
  const [totalTONSum, setTotalTONSum] = useState<number>(0)
  const [totalTURXSum, setTotalTURXSum] = useState<number>(0)
  const [usersColumnData, setUsersColumnData] = useState<AdminProfile[]>()
  const [isAvialableToWrite, setIsAvialableToWrite] = useState<boolean>(false)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>()
  const [selectedDateRangeTONSum, setSelectedDateRangeTONSum] =
    useState<number>(0)
  const [selectedDateRangeKwtSum, setSelectedDateRangeKwtSum] =
    useState<number>(0)

  useEffect(() => {
    setTotalTONSum(
      profiles.reduce((acc, user) => {
        if (!user?.TONBalance) return acc
        return acc + user.TONBalance
      }, 0),
    )
    setTotalTURXSum(
      profiles.reduce((acc, user) => {
        if (!user?.WindBalance) return acc
        return acc + user.WindBalance
      }, 0),
    )

    setSelectedDateRangeTONSum(
      profiles
        .filter((user) =>
          isWithinInterval(
            new Date(user.created_at ?? new Date().toISOString()),
            interval(
              selectedDateRange?.to ?? new Date(),
              selectedDateRange?.from ?? new Date(),
            ),
          ),
        )
        .reduce((acc, user) => {
          if (!user?.TONBalance) return acc
          return acc + user.TONBalance
        }, 0),
    )
    setSelectedDateRangeKwtSum(
      profiles
        .filter((user) =>
          isWithinInterval(
            new Date(user.created_at ?? new Date().toISOString()),
            interval(
              selectedDateRange?.to ?? new Date(),
              selectedDateRange?.from ?? new Date(),
            ),
          ),
        )
        .reduce((acc, user) => {
          if (!user?.WindBalance) return acc
          return acc + user.WindBalance
        }, 0),
    )
  }, [profiles, isLoading, selectedDateRange])

  useEffect(() => {
    const loadWithdrawals = async () => {
      try {
        const data = await fetchWithdrawals()
        setWithdrawals(data)
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }

    loadWithdrawals()
  }, [])

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

  const filterableColumns: FilterableColumn[] = [
    {
      id: "id",
      title: "ID",
      type: "text",
    },
    {
      id: "telegramID",
      title: "Telegram ID",
      type: "text",
    },
    {
      id: "userName",
      title: "Username",
      type: "text",
    },
    {
      id: "ton_balance",
      title: "TON Balance",
      type: "number",
    },
    {
      id: "coin_balance",
      title: "кВт",
      type: "number",
    },
    {
      id: "first_name",
      title: "First Name",
      type: "text",
    },
    {
      id: "last_name",
      title: "Last Name",
      type: "text",
    },
    {
      id: "invitedBy",
      title: "Запросив",
      type: "text",
    },
    {
      id: "wallet",
      title: "Wallet",
      type: "text",
    },
  ]

  useEffect(() => {
    setUsersColumnData(
      profiles.map((user) => {
        const referalUsers = profiles.filter(
          (anotherUser) => anotherUser.invitedBy === user.telegramID,
        )

        if (user.referalCount === undefined)
          return {
            ...user,
            referalCount: referalUsers ? referalUsers.length : 0,
          }

        return {
          ...user,
          referalCount: referalUsers ? referalUsers.length : 0,
        }
      }),
    )
  }, [profiles])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Користувачі</h1>
        <EnhancedDatePicker setSelectedDateRange={setSelectedDateRange} />
        <div className="flex gap-10">
          <div className="text-1xl m-1 w-72 border-2 bg-gray-400 p-2 font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-925 dark:text-gray-50">
            <h1>Загальна сума в обранному періоду</h1>
            <Sum label="кВт" sum={selectedDateRangeKwtSum} />
            <Sum label="TON" sum={selectedDateRangeTONSum} />
          </div>
          <div className="text-1xl m-1 min-w-max border bg-gray-400 p-2 font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-925 dark:text-gray-50">
            <h1>Загальна сума</h1>
            <Sum label="кВт" sum={totalTURXSum} />
            <Sum label="TON" sum={totalTONSum} />
          </div>
        </div>
        {/* {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )} */}
      </div>

      <Card className="p-0">
        <DataTable
          selectedDateRange={selectedDateRange}
          data={usersColumnData ?? profiles}
          columns={userColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
          openSidebarOnRowClick={true}
          onRowClick={(row) => setActiveUser(row)}
        />
      </Card>
      {activeUser &&
        (() => {
          const userWithdrawals = withdrawals?.filter(
            (w) => w.uid === activeUser.id,
          )

          console.log(
            "User withdrawals for",
            activeUser.id,
            "=>",
            userWithdrawals,
          )

          return (
            <UserSidebar
              user={activeUser}
              onClose={() => setActiveUser(null)}
              onUpdate={(updatedUser) => {
                updateUser(updatedUser)
                setActiveUser(updatedUser)
              }}
              tableData={userWithdrawals}
              tableColumns={withdrawalsColumns}
              filterableColumns={filterableColumns}
              isAvialableToWrite={isAvialableToWrite}
            />
          )
        })()}
    </>
  )
}
