"use client"
import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminReferralEarningsStore } from "@/stores/admin/useAdminReferralEarningsStore"
import { FilterableColumn } from "@/types/table"
import { useCallback, useEffect, useState } from "react"
import { referralEarningColumns } from "./_components/ReferralEarningColumns"
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker"
import { DateRange } from "react-day-picker"
import Sum from "@/components/Sum"
import { fetchUserPermissions, useAdminReferralsStore } from "@/stores/admin/useAdminReferralsStore"
import { ReferralEarning } from "@/types/referralEarning"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import NotAllowed from "@/components/NotAllowed"
import { interval, isWithinInterval } from "date-fns"
import { TableCell, TableRow } from "@/components/Table"
import { CreatePermissionDto } from "@/stores/admin/useAdminPermissionsStore"

export default function ReferralEarningsAdminPage() {
  const { 
    referralEarnings, 
    isLoading, 
    referralEarnings1,
    referralEarnings2, 
    referralEarnings3, 
    referralEarnings4, 
    referralEarnings5,
    fetchReferralEarnings,
    fetchReferralEarningsReferals
  } = useAdminReferralEarningsStore()
  const { profiles } = useAdminReferralsStore()
  const [referalSum, setReferalSum] = useState<number>()
  const [selectedDateRangeSum, setSelectedDateRangeSum] = useState<number>(0)
  const [referralEarningsData, setReferralEarningsData] =
    useState<ReferralEarning[]>()
  const userRole = useUserStore(roleSelector)
  const [aggregatedValue] = useState<string | number | null>(null)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>()

  const [selectedRowid, setSelectedRowid] = useState<string>('')
  const [selectedSubRowId, setSelectedSubRowId] = useState<string>('')
  const [selectedSub3RowId, setSelectedSub3RowId] = useState<string>('')
  const [selectedSub4RowId, setSelectedSub4RowId] = useState<string>('')
  const [selectedSub5RowId, setSelectedSub5RowId] = useState<string>('')
  // const [isAvialableToWrite, setIsAvialableToWrite] = useState<boolean>(false)
  const [userPermissions, setUserPermissionsData] =
  useState<CreatePermissionDto | null>(null)

  useEffect(() => {
    if (userPermissions) {
      if (userPermissions?.additionalField) {
        fetchReferralEarningsReferals(userPermissions?.additionalField ?? '', 0)
      } else {
        fetchReferralEarnings(0)
      }
    }
  }, [fetchReferralEarnings, fetchReferralEarningsReferals, userPermissions])

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await fetchUserPermissions()
        setUserPermissionsData(data)
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }
    loadPermissions()
  }, [])

  useEffect(() => {
    setReferalSum(referralEarnings.reduce((sum, item) => sum + item.amount, 0))
    setSelectedDateRangeSum(
      referralEarnings
        .filter((item) =>
          isWithinInterval(
            item.created_at,
            interval(
              selectedDateRange?.to ?? new Date(),
              selectedDateRange?.from ?? new Date(),
            ),
          ),
        )
        .reduce((sum, item) => sum + item.amount, 0),
    )
    const earningsWithReferalCount = referralEarnings.map((earning) => {
      const referralUser = profiles.find(
        (u) => Number(u.telegramID) === Number(earning.user?.id),
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
  }, [profiles, referralEarnings, selectedDateRange])

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
      title: "Сума квт",
      type: "number",
    },
    {
      id: "tonAmount",
      title: "Сума TON",
      type: "number",
    },
    {
      id: "created_at",
      title: "Дата",
      type: "dateRange",
    },
  ]

  const handleReferalData = useCallback((row: ReferralEarning, level: number) => {
    console.log('row', row)
    if (row.user?.id) {
        if (level === 4) {
          setSelectedSub4RowId(row.user.id.toString() === selectedSub4RowId ? '' : row.user.id.toString())
          if (row.user.id.toString() != selectedSub4RowId) {
            setSelectedSub5RowId('')
          }
        } else if (level === 3) {
          setSelectedSub3RowId(row.user.id.toString() === selectedSub3RowId ? '' : row.user.id.toString())
          if (row.user.id.toString() != selectedSub3RowId) {
            setSelectedSub4RowId('')
            setSelectedSub5RowId('')
          }
        } else if (level === 2) {
          setSelectedSubRowId(row.user.id.toString() === selectedSubRowId ? '' : row.user.id.toString())
          if (row.user.id.toString() != selectedSubRowId) {
            setSelectedSub3RowId('')
            setSelectedSub4RowId('')
            setSelectedSub5RowId('')
          }
        } else if (level === 1) {
          setSelectedRowid(row.user.id.toString() === selectedRowid ? '' : row.user.id.toString())
          if (row.user.id.toString() != selectedRowid) {
            setSelectedSubRowId('')
            setSelectedSub3RowId('')
            setSelectedSub4RowId('')
            setSelectedSub5RowId('')
          }
        }
      }
      if (level === 0) {
        fetchReferralEarnings(level)
      } else {
        fetchReferralEarningsReferals(row.user?.telegramID?.toString() || '', level)
      }
  }, [
    setSelectedRowid, 
    selectedRowid,
    fetchReferralEarningsReferals,
    selectedSubRowId, 
    selectedSub3RowId, 
    selectedSub4RowId, 
    selectedSub5RowId, 
    fetchReferralEarnings, 
    setSelectedSubRowId, 
    setSelectedSub3RowId,
    setSelectedSub4RowId,
    setSelectedSub5RowId,
  ])

  if (!(userRole === "admin" || userRole === "teamlead" || userRole === "marketing")) return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="mr-1 text-2xl font-semibold">Реферальні</h1>
        <EnhancedDatePicker setSelectedDateRange={setSelectedDateRange} />
        <Sum
          label="Загальна сума в кВт в обранному періоду"
          sum={selectedDateRangeSum}
        />
        <Sum label="Загальна сума в кВт" sum={referalSum ?? 0} />
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={referralEarningsData ?? referralEarnings}
          columns={referralEarningColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
          openSidebarOnRowClick={true}
          onRowClick={(row) => handleReferalData(row, 1)}
          selectedRowid={selectedRowid}
          dropDownComponent={
             referralEarnings1.length ? <DataTable
              selectedDateRange={selectedDateRange}
              data={referralEarnings1}
              columns={referralEarningColumns}
              openSidebarOnRowClick={true}
              filterableColumns={filterableColumns}
              onRowClick={(row) => handleReferalData(row, 2)}
              selectedRowid={selectedSubRowId}
              isLoading={isLoading}
              dropDownComponent={
                referralEarnings2.length ? <DataTable
                  selectedDateRange={selectedDateRange}
                  data={referralEarnings2}
                  columns={referralEarningColumns}
                  filterableColumns={filterableColumns}
                  isLoading={isLoading}
                  openSidebarOnRowClick={true}
                  onRowClick={(row) => handleReferalData(row, 3)}
                  selectedRowid={selectedSub3RowId}
                  dropDownComponent={
                    referralEarnings3.length ? <DataTable
                      selectedDateRange={selectedDateRange}
                      data={referralEarnings3}
                      columns={referralEarningColumns}
                      filterableColumns={filterableColumns}
                      isLoading={isLoading}
                      openSidebarOnRowClick={true}
                      onRowClick={(row) => handleReferalData(row, 4)}
                      selectedRowid={selectedSub4RowId}
                      dropDownComponent={
                        referralEarnings4.length ? <DataTable
                          selectedDateRange={selectedDateRange}
                          data={referralEarnings4}
                          openSidebarOnRowClick={true}
                          columns={referralEarningColumns}
                          filterableColumns={filterableColumns}
                          isLoading={isLoading}
                          onRowClick={(row) => handleReferalData(row, 5)}
                          selectedRowid={selectedSub5RowId}
                          dropDownComponent={
                            referralEarnings5.length ? <DataTable
                              selectedDateRange={selectedDateRange}
                              data={referralEarnings5}
                              openSidebarOnRowClick={true}
                              columns={referralEarningColumns}
                              filterableColumns={filterableColumns}
                              isLoading={isLoading}
                            /> : 
                            <TableRow>
                              <TableCell
                                colSpan={ referralEarningColumns.length }
                                className="h-24 text-center text-gray-500"
                              > 
                                  Немає результатів
                              </TableCell>
                            </TableRow>
                          }
                        /> :
                        <TableRow>
                          <TableCell
                            colSpan={ referralEarningColumns.length }
                            className="h-24 text-center text-gray-500"
                          > 
                            Немає результатів
                          </TableCell>
                        </TableRow>
                      } 
                    /> :
                    <TableRow>
                      <TableCell
                        colSpan={ referralEarningColumns.length }
                        className="h-24 text-center text-gray-500"
                      > 
                        Немає результатів
                      </TableCell>
                    </TableRow>
                  }
                /> :
                <TableRow>
                  <TableCell
                    colSpan={ referralEarningColumns.length }
                    className="h-24 text-center text-gray-500"
                  > 
                    Немає результатів
                  </TableCell>
                </TableRow>
              }
            /> 
            :
            <TableRow>
              <TableCell
                colSpan={ referralEarningColumns.length }
                className="h-24 text-center text-gray-500"
              > 
                Немає результатів
              </TableCell>
            </TableRow>
          }
        />
      </Card>
    </>
  )
}
