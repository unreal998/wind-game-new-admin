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
import { TableCell, TableRow } from "@/components/Table"
import { CreatePermissionDto } from "@/stores/admin/useAdminPermissionsStore"
import { getUserData } from "../users/_components/updateUserBalance"

export default function ReferralEarningsAdminPage() {
  const { 
    referralEarnings, 
    isLoading, 
    isLoadingEarnings1,
    isLoadingEarnings2,
    isLoadingEarnings3,
    isLoadingEarnings4,
    isLoadingEarnings5,
    referralEarnings1,
    referralEarnings2, 
    referralEarnings3, 
    referralEarnings4, 
    referralEarnings5,
    fetchReferralEarnings,
    fetchReferralEarningsReferals,
    fetchReferralStats,
    searchReferralEarnings,
  } = useAdminReferralEarningsStore()
  const { profiles } = useAdminReferralsStore()
  const [referalSum, setReferalSum] = useState<number>(0)
  const [referalTonSum, setReferalTonSum] = useState<number>(0)
  const userRole = useUserStore(roleSelector)
  const [aggregatedValue] = useState<string | number | null>(null)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>()

  const [selectedRowid, setSelectedRowid] = useState<string>('')
  const [selectedSubRowId, setSelectedSubRowId] = useState<string>('')
  const [selectedSub3RowId, setSelectedSub3RowId] = useState<string>('')
  const [selectedSub4RowId, setSelectedSub4RowId] = useState<string>('')
  const [selectedSub5RowId, setSelectedSub5RowId] = useState<string>('')
  const [userPermissions, setUserPermissionsData] =
  useState<CreatePermissionDto | null>(null)

  useEffect(() => {
    if (!userPermissions) return;

    const loadUserData = async (userPermissionsData: CreatePermissionDto) => {
      if (userPermissionsData?.additionalField) {
        let ownerData = await getUserData({
          id: String(userPermissionsData?.additionalField),
        })
        if (userPermissionsData?.type === "marketing" && userPermissionsData?.additionalField && ownerData) {
          ownerData = { ...ownerData, user: { username: ownerData.userName } }
          fetchReferralEarningsReferals(userPermissionsData?.additionalField ?? '', 0, ownerData)
        }
      } else {
        fetchReferralEarnings()
      }
    }
    loadUserData(userPermissions)
    
  }, [userPermissions])

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
    const fetchReferralStatsData = async () => {
      const { tonData, kwtData } = await fetchReferralStats()
      setReferalTonSum(tonData)
      setReferalSum(kwtData)
    }
    fetchReferralStatsData()
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

    if (row.user?.id) {
        if (level === 5) {
          setSelectedSub5RowId(row.user.id.toString() === selectedSub5RowId ? '' : row.user.id.toString())
        } else if (level === 4) {
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
        fetchReferralEarnings()
      } else {
        fetchReferralEarningsReferals(row.user?.telegramID?.toString() || '', level, row)
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

  const handleSearchChange = useCallback((search: string) => {
    async function fetchSearchReferralEarnings(search: string) {
      const data = await searchReferralEarnings(search)
      if (!data) return;
      const reversedData = data.reverse();
      console.log(reversedData)
      for (const item of reversedData) {
        setSelectedRowid(item.toString())
      }
    }
    fetchSearchReferralEarnings(search)
  }, [searchReferralEarnings])

  if (!(userRole === "admin" || userRole === "teamlead" || userRole === "marketing")) return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="mr-1 text-2xl font-semibold">Реферальні</h1>
        <EnhancedDatePicker setSelectedDateRange={setSelectedDateRange} />

        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>
      {userPermissions?.type !== "marketing" && <div className="flex gap-10">
         <Sum
          label="Загальна сума в TON"
          sum={referalTonSum}
        />
        <Sum label="Загальна сума в кВт" sum={referalSum ?? 0} />
      </div>}
      <Card className="p-0">
        <DataTable
          data={referralEarnings}
          title={`Поточний ланцюг: ${selectedRowid} -> ${selectedSubRowId} -> ${selectedSub3RowId} -> ${selectedSub4RowId} -> ${selectedSub5RowId}`}
          columns={referralEarningColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
          openSidebarOnRowClick={true}
          onRowClick={(row) => handleReferalData(row, 1)}
          selectedRowid={selectedRowid}
          onSearchChange={(search: string) => handleSearchChange(search)}
          dropDownComponent={
             referralEarnings1.length && !isLoadingEarnings1 ? <DataTable
              border="1px solid red"
              selectedDateRange={{ from: selectedDateRange?.from || new Date(), to: selectedDateRange?.to || new Date() }}
              data={referralEarnings1}
              columns={referralEarningColumns}
              openSidebarOnRowClick={true}
              simple
              filterableColumns={filterableColumns}
              onRowClick={(row) => handleReferalData(row, 2)}
              selectedRowid={selectedSubRowId}
              isLoading={isLoadingEarnings1}
              dropDownComponent={
                referralEarnings2.length && !isLoadingEarnings2 ? <DataTable
                  border="1px solid green"
                  selectedDateRange={{ from: selectedDateRange?.from || new Date(), to: selectedDateRange?.to || new Date() }}
                  data={referralEarnings2}
                  columns={referralEarningColumns}
                  filterableColumns={filterableColumns}
                  isLoading={isLoadingEarnings2}
                  openSidebarOnRowClick={true}
                  onRowClick={(row) => handleReferalData(row, 3)}
                  simple
                  selectedRowid={selectedSub3RowId}
                  dropDownComponent={
                    referralEarnings3.length && !isLoadingEarnings3 ? <DataTable
                      border="1px solid blue"
                      selectedDateRange={{ from: selectedDateRange?.from || new Date(), to: selectedDateRange?.to || new Date() }}
                      data={referralEarnings3}
                      columns={referralEarningColumns}
                      filterableColumns={filterableColumns}
                      isLoading={isLoadingEarnings3}
                      simple
                      openSidebarOnRowClick={true}
                      onRowClick={(row) => handleReferalData(row, 4)}
                      selectedRowid={selectedSub4RowId}
                      dropDownComponent={
                        referralEarnings4.length && !isLoadingEarnings4 ? <DataTable
                          border="1px solid yellow"
                          selectedDateRange={{ from: selectedDateRange?.from || new Date(), to: selectedDateRange?.to || new Date() }}
                          data={referralEarnings4}
                          openSidebarOnRowClick={true}
                          columns={referralEarningColumns}
                          filterableColumns={filterableColumns}
                          simple
                          isLoading={isLoadingEarnings4}
                          onRowClick={(row) => handleReferalData(row, 5)}
                          selectedRowid={selectedSub5RowId}
                          dropDownComponent={
                            referralEarnings5.length ? <DataTable
                              border="1px solid purple"
                              selectedDateRange={{ from: selectedDateRange?.from || new Date(), to: selectedDateRange?.to || new Date() }}
                              data={referralEarnings5}
                              openSidebarOnRowClick={true}
                              columns={referralEarningColumns}
                              simple
                              filterableColumns={filterableColumns}
                              isLoading={isLoadingEarnings5}
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
