"use client"

import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminReferralsStore } from "@/stores/admin/useAdminReferralsStore"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { userColumns } from "./_components/UserColumns"
import { UserSidebar } from "./_components/UserSidebar"
import { fetchWithdrawals } from "./_components/fetchWithdrawals"
import { withdrawalsColumns } from "./_components/withdrawalsColumns"
import Sum from "@/components/Sum"
import { AdminProfile } from "@/types/profile"

export default function ReferralsAdminPage() {
  const { profiles, isLoading, updateUser } = useAdminReferralsStore()
  const [activeUser, setActiveUser] = useState<any | null>(null)
  const [withdrawals, setWithdrawals] = useState<any[]>()
  const [totalTONSum, setTotalTONSum] = useState<number>(0)
  const [totalTURXSum, setTotalTURXSum] = useState<number>(0)
  const [usersColumnData, setUsersColumnData] = useState<AdminProfile[]>()

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
  }, [profiles, isLoading])

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
      title: "kwt",
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
        <Sum label="Загальна сумма кВт" sum={totalTURXSum} />
        <Sum label="Загальна сумма TON" sum={totalTONSum} />
        {/* {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )} */}
      </div>

      <Card className="p-0">
        <DataTable
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
            />
          )
        })()}
    </>
  )
}
