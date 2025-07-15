"use client"

import { useEffect, useState } from "react"
import { CreatePermissionModal } from "./components/CreatePermissionModal"
import { useAdminPermissionsStore } from "@/stores/admin/useAdminPermissionsStore"
import { Card } from "@/components"
import { DataTable } from "@/components/data-table/DataTable"
import { permissionColumns } from "./components/permissionsColumnData"
import { Button } from "@/components"
import useIsAvailableToWrite from "@/hooks/useIsAvailableToWrite"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import NotAllowed from "@/components/NotAllowed"
import { DateRange } from "react-day-picker"
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker"

export default function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>()
  const { isLoading, permissions, fetchPermissions } =
    useAdminPermissionsStore()
  const { isAvialableToWrite } = useIsAvailableToWrite()
  const userRole = useUserStore(roleSelector)

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])
  if (userRole !== "admin") return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Дозволи</h1>
        <EnhancedDatePicker setSelectedDateRange={setSelectedDateRange} />
        <div className="flex items-center gap-2">
          {isAvialableToWrite && (
            <Button onClick={() => setModalOpen(true)}>Додати</Button>
          )}
        </div>
        {modalOpen && (
          <CreatePermissionModal onClose={() => setModalOpen(false)} />
        )}
      </div>
      <Card className="p-0">
        <DataTable
          selectedDateRange={selectedDateRange}
          data={permissions}
          columns={permissionColumns}
          isLoading={isLoading}
          openSidebarOnRowClick={true}
        />
      </Card>
    </>
  )
}
