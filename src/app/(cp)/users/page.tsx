"use client"

import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import {
  fetchUserPermissions,
  useAdminReferralsStore,
} from "@/stores/admin/useAdminReferralsStore"
import { FilterableColumn } from "@/types/table"
import { useCallback, useEffect, useState } from "react"
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
import { CreatePermissionDto } from "@/stores/admin/useAdminPermissionsStore"
import { TableCell, TableRow } from "@/components/Table"

export default function ReferralsAdminPage() {
  const { 
    profiles, 
    isLoading, 
    updateUser, 
    marketingProfiles, 
    fetchMarketingProfiles, 
    fetchMarketingReferalsProfiles, 
    fetchMarketingSubReferalsProfiles, 
    fetchMarketingSubReferalsProfiles3, 
    fetchMarketingSubReferalsProfiles4, 
    fetchMarketingSubReferalsProfiles5, 
    marketingReferalsProfiles, 
    marketingSubReferalsProfiles,
    marketingSubReferalsProfiles3,
    marketingSubReferalsProfiles4,
    marketingSubReferalsProfiles5,
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
  
  const [userPermissions, setUserPermissionsData] = useState<CreatePermissionDto | null>(null)
  const [selectedRowid, setSelectedRowid] = useState<string>('')
  const [selectedSubRowId, setSelectedSubRowId] = useState<string>('')
  const [selectedSub3RowId, setSelectedSub3RowId] = useState<string>('')
  const [selectedSub4RowId, setSelectedSub4RowId] = useState<string>('')
  const [selectedSub5RowId, setSelectedSub5RowId] = useState<string>('')

  const handleSubReferalData = useCallback((row: AdminProfile) => {
    setSelectedSubRowId(row.id === selectedSubRowId ? '' : row.id)
    if (row.id != selectedSubRowId) {
      setSelectedSub3RowId('')
      setSelectedSub4RowId('')
      setSelectedSub5RowId('')
      fetchMarketingSubReferalsProfiles(row.telegramID)
    }
  }, [setSelectedSubRowId, selectedSubRowId, fetchMarketingSubReferalsProfiles])

  const handleSub3ReferalData = useCallback((row: AdminProfile) => {
    setSelectedSub3RowId(row.id === selectedSub3RowId ? '' : row.id)
    if (row.id != selectedSub3RowId) {
      setSelectedSub4RowId('')
      setSelectedSub5RowId('')
      fetchMarketingSubReferalsProfiles3(row.telegramID)
    }
  }, [setSelectedSub3RowId, selectedSub3RowId, fetchMarketingSubReferalsProfiles3])

  const handleSub4ReferalData = useCallback((row: AdminProfile) => {
    setSelectedSub4RowId(row.id === selectedSub4RowId ? '' : row.id)
    if (row.id != selectedSub4RowId) {
      setSelectedSub5RowId('')
      fetchMarketingSubReferalsProfiles4(row.telegramID)
    }
  }, [setSelectedSub4RowId, selectedSub4RowId, fetchMarketingSubReferalsProfiles4])

  const handleSub5ReferalData = useCallback((row: AdminProfile) => {
    setSelectedSub5RowId(row.id === selectedSub5RowId ? '' : row.id)
    if (row.id != selectedSub5RowId) {
      fetchMarketingSubReferalsProfiles5(row.telegramID)
    }
  }, [setSelectedSub5RowId, selectedSub5RowId, fetchMarketingSubReferalsProfiles5])

  const handleReferalData = useCallback((row: AdminProfile) => {
    setSelectedRowid(row.id === selectedRowid ? '' : row.id)
    if (row.id != selectedRowid) {
      setSelectedSubRowId('')
      setSelectedSub3RowId('')
      setSelectedSub4RowId('')
      setSelectedSub5RowId('')
      fetchMarketingReferalsProfiles(row.telegramID)
    }

  }, [
    setSelectedRowid, 
    selectedRowid, 
    fetchMarketingReferalsProfiles, 
    setSelectedSubRowId,
    setSelectedSub3RowId,
    setSelectedSub4RowId,
    setSelectedSub5RowId,
  ])

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
        setUserPermissionsData(data)

      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }

    loadPermissions()
  }, [userRole])

  useEffect(() => {
    if (userRole === "marketing" && userPermissions?.additionalField) {
      fetchMarketingProfiles(userPermissions?.additionalField || '')
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
            }

          return {
            ...user,
            referalCount: referalUsers ? referalUsers.length : 0,
          }
        }),
      )
    }
  }, [userRole, userPermissions?.additionalField, profiles])

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
        <EnhancedDatePicker setSelectedDateRange={setSelectedDateRange} />
        {userRole && userRole !== "marketing" && <div className="flex gap-10">
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
    }
      </div>

      <Card className="p-0">
        {userRole && userRole !== "marketing" && <DataTable
          selectedDateRange={selectedDateRange}
          data={usersColumnData ?? profiles}
          columns={userColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
          openSidebarOnRowClick={true}
          onRowClick={(row) => setActiveUser(row)}
        />}
        {userRole === "marketing" && <DataTable
          data={marketingProfiles}
          columns={userColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
          openSidebarOnRowClick={true}
          onRowClick={(row) => handleReferalData(row)}
          selectedRowid={selectedRowid}
          dropDownComponent={
            marketingReferalsProfiles.length > 0 ?
              <DataTable
                selectedDateRange={selectedDateRange}
                data={marketingReferalsProfiles}
                columns={userColumns}
                filterableColumns={filterableColumns}
                isLoading={isLoading}
                openSidebarOnRowClick={true}
                onRowClick={(row) => handleSubReferalData(row)}
                selectedRowid={selectedSubRowId}
                dropDownComponent={
                  marketingSubReferalsProfiles.length > 0 ? <DataTable
                    selectedDateRange={selectedDateRange}
                    data={marketingSubReferalsProfiles}
                    columns={userColumns}
                    filterableColumns={filterableColumns}
                    isLoading={isLoading}
                    openSidebarOnRowClick={true}
                    onRowClick={(row) => handleSub3ReferalData(row)}
                    selectedRowid={selectedSub3RowId}
                    dropDownComponent={ marketingSubReferalsProfiles3.length > 0 ? <DataTable
                      selectedDateRange={selectedDateRange}
                      data={marketingSubReferalsProfiles3}
                      columns={userColumns}
                      filterableColumns={filterableColumns}
                      isLoading={isLoading}
                      openSidebarOnRowClick={true}
                      onRowClick={(row) => handleSub4ReferalData(row)}
                      selectedRowid={selectedSub4RowId}
                      dropDownComponent={ marketingSubReferalsProfiles4.length > 0 ? <DataTable
                        selectedDateRange={selectedDateRange}
                        data={marketingSubReferalsProfiles4}
                        columns={userColumns}
                        filterableColumns={filterableColumns}
                        isLoading={isLoading}
                        openSidebarOnRowClick={true}
                        onRowClick={(row) => handleSub5ReferalData(row)}
                        selectedRowid={selectedSub5RowId}
                        dropDownComponent={ marketingSubReferalsProfiles5.length > 0 ? <DataTable
                          selectedDateRange={selectedDateRange}
                          data={marketingSubReferalsProfiles5}
                          columns={userColumns}
                          filterableColumns={filterableColumns}
                          isLoading={isLoading}
                          openSidebarOnRowClick={true}
                          onRowClick={(row) => setActiveUser(row)}
                          /> : <TableRow>
                            <TableCell
                              colSpan={ userColumns.length }
                              className="h-24 text-center text-gray-500"
                            > 
                                Немає результатів
                            </TableCell>
                        </TableRow>
                      }
                        /> : <TableRow>
                            <TableCell
                              colSpan={ userColumns.length }
                              className="h-24 text-center text-gray-500"
                            > 
                                Немає результатів
                            </TableCell>
                        </TableRow>
                      }
                    /> : 
                    <TableRow>
                        <TableCell
                          colSpan={ userColumns.length }
                          className="h-24 text-center text-gray-500"
                        > 
                            Немає результатів
                        </TableCell>
                    </TableRow>
                    }
                  /> : 
                  <TableRow>
                    <TableCell
                      colSpan={ userColumns.length }
                      className="h-24 text-center text-gray-500"
                    >
                        Немає результатів
                    </TableCell>
                </TableRow>
                }
              />
              : <TableRow>
                <TableCell
                  colSpan={ userColumns.length }
                  className="h-24 text-center text-gray-500"
                >
                    Немає результатів
                </TableCell>
              </TableRow>
          }
        />}
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
