"use client"

import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import {
  fetchUserDataByTid,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import {
  AdminProfile,
  AdminProfileTeams,
  adminProfileTeams,
} from "@/types/profile"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker"
import { DateRange } from "react-day-picker"
import { CreatePermissionDto } from "@/stores/admin/useAdminPermissionsStore"

export default function ReferralsAdminPage() {
  const {
    profiles,
    isLoading,
    updateUser,
    marketingProfiles,
    fetchMarketingProfiles,
    fetchKWTBalance,
    fethTonBalance,
  } = useAdminReferralsStore()

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
  const [teamFilter, setTeamFilter] = useState<AdminProfileTeams | "all">("all")

  const [userPermissions, setUserPermissionsData] =
    useState<CreatePermissionDto | null>(null)

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

    const loadKWTBalance = async () => {
      const kwtBalance = await fetchKWTBalance(selectedDateRange)
      setSelectedDateRangeKwtSum(kwtBalance)
    }
    loadKWTBalance()

    const loadBalance = async () => {
      const balance = await fethTonBalance(selectedDateRange)
      setSelectedDateRangeTONSum(balance)
    }
    loadBalance()

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
        setUserPermissionsData(data)
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }

    loadPermissions()
  }, [userRole])

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUserDataByTid(
        userPermissions?.additionalField ?? "",
      )
      fetchMarketingProfiles(userData.team ?? "")
    }

    if (userRole === "marketing" && userPermissions?.additionalField) {
      loadUserData()
      if (teamFilter && teamFilter != "all") {
        setUsersColumnData(
          marketingProfiles
            .map((user) => {
              const referalUsers = marketingProfiles.filter(
                (anotherUser) => anotherUser.invitedBy === user.telegramID,
              )

              if (user.referalCount === undefined)
                return {
                  ...user,
                  referalCount: referalUsers ? referalUsers.length : 0,
                  inactiveReferalCount: referalUsers ? user.referals?.length - referalUsers.length : 0,
                }

              return {
                ...user,
                referalCount: referalUsers ? referalUsers.length : 0,
                inactiveReferalCount: referalUsers ? user.referals?.length - referalUsers.length : 0,
              }
            })
            .filter((user) => user.team === teamFilter),
        )
      } else {
        setUsersColumnData(undefined)
      }
    } else {
      if (teamFilter && teamFilter != "all") {
        setUsersColumnData(
          profiles
            .map((user) => {
              const referalUsers = profiles.filter(
                (anotherUser) => anotherUser.invitedBy === user.telegramID,
              )

              if (user.referalCount === undefined)
                return {
                  ...user,
                  referalCount: referalUsers ? referalUsers.length : 0,
                  inactiveReferalCount: referalUsers ? user.referals?.length - referalUsers.length : 0,
                }

              return {
                ...user,
                referalCount: referalUsers ? referalUsers.length : 0,
                inactiveReferalCount: referalUsers ? user.referals?.length - referalUsers.length : 0,
              }
            })
            .filter((user) => user.team === teamFilter),
        )
      } else {
        setUsersColumnData(
          profiles.map((user) => {
            const referalUsers = profiles.filter(
              (anotherUser) => anotherUser.invitedBy === user.telegramID,
            )

            if (user.referalCount === undefined)
              return {
                ...user,
                referalCount: referalUsers ? referalUsers.length : 0,
                inactiveReferalCount: referalUsers ? user.referals?.length - referalUsers.length : 0,
              }

            return {
              ...user,
              referalCount: referalUsers ? referalUsers.length : 0,
              inactiveReferalCount: referalUsers ? user.referals?.length - referalUsers.length : 0,
            }
          }),
        )
      }
    }
  }, [
    userRole,
    userPermissions?.additionalField,
    profiles,
    fetchUserDataByTid,
    teamFilter,
  ])

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

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Користувачі</h1>
        <div className="flex items-center gap-2">
          <EnhancedDatePicker setSelectedDateRange={setSelectedDateRange} />
          {userRole && (
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
          )}
        </div>
      </div>
      <div className="flex gap-10">
        {userRole && userRole !== "marketing" && (
            <div className="flex gap-10">
              <div className="text-1xl m-1 w-72 border-2 bg-gray-400 p-2 font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-925 dark:text-gray-50">
                <h1>Загальна сума в обранному періоду</h1>
                <Sum label="кВт" sum={Number((Math.floor(selectedDateRangeKwtSum * 100) / 100).toFixed(2))} />
                <Sum label="TON" sum={Number((Math.floor(selectedDateRangeTONSum * 100) / 100).toFixed(2))} />
              </div>
              <div className="text-1xl m-1 min-w-max border bg-gray-400 p-2 font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-925 dark:text-gray-50">
                <h1>Загальна сума</h1>
                <Sum label="кВт" sum={totalTURXSum} />
                <Sum label="TON" sum={totalTONSum} />
              </div>
            </div>
        )}
      </div>
      <Card className="p-0">
        {userRole && userRole !== "marketing" && (
          <DataTable
            selectedDateRange={{ from: selectedDateRange?.from || new Date(), to: selectedDateRange?.to || new Date() }}
            data={usersColumnData ?? profiles}
            columns={userColumns}
            filterableColumns={filterableColumns}
            isLoading={isLoading}
            openSidebarOnRowClick={true}
            onRowClick={(row) => setActiveUser(row)}
          />
        )}
        {userRole === "marketing" && (
          <DataTable
            data={usersColumnData ?? marketingProfiles}
            columns={userColumns}
            filterableColumns={filterableColumns}
            isLoading={isLoading}
            openSidebarOnRowClick={true}
            onRowClick={(row) => setActiveUser(row)}
          />
        )}
      </Card>
      {activeUser &&
        (() => {
          const userWithdrawals = withdrawals?.filter(
            (w) => w.uid === activeUser.id,
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
