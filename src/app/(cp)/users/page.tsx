"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminReferralsStore } from "@/stores/admin/useAdminReferralsStore"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { userColumns } from "./_components/UserColumns"
import { UserSidebar } from "./_components/UserSidebar"
import { fetchWithdrawals } from "./_components/fetchWithdrawals"
import { withdrawalsColumns } from "./_components/withdrawalsColumns"

export default function ReferralsAdminPage() {
  const { profiles, isLoading, updateUser } = useAdminReferralsStore()
  const [aggregatedValue, setAggregatedValue] = useState<
    string | number | null
  >(null)
  const [activeUser, setActiveUser] = useState<any | null>(null)
  const [withdrawals, setWithdrawals] = useState<any[]>()

  const handleUpdateUser = (updated: any) => {
    setActiveUser(updated)
  }

  useEffect(() => {
    const loadWithdrawals = async () => {
      try {
        const data = await fetchWithdrawals()
        console.log("Withdrawals:", data)
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
      title: "Wind Balance",
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
      id: "wallet",
      title: "Wallet",
      type: "text",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Користувачі</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={profiles}
          columns={userColumns}
          filterableColumns={filterableColumns}
          aggregations={[
            {
              columnId: "ton_balance",
              type: "sum",
              onResult: setAggregatedValue,
            },
          ]}
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
