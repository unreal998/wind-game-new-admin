"use client"

import { useEffect, useState } from "react"
import { CreatePermissionModal } from "./components/CreatePermissionModal"
import { useAdminPermissionsStore } from "@/stores/admin/useAdminPermissionsStore"
import { Card } from "@/components"
import { DataTable } from "@/components/data-table/DataTable"
import { getPermissionColumns } from "./components/permissionsColumnData"
import { Button } from "@/components"
import useIsAvailableToWrite from "@/hooks/useIsAvailableToWrite"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import NotAllowed from "@/components/NotAllowed"

export default function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { isLoading, permissions, fetchPermissions } =
    useAdminPermissionsStore()
  const { isAvialableToWrite } = useIsAvailableToWrite()
  const userRole = useUserStore(roleSelector)

  useEffect(() => {
    fetchPermissions()
  }, [])
  if (userRole !== "admin") return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Дозволи</h1>
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
          data={permissions}
          columns={getPermissionColumns(isAvialableToWrite ?? false)}
          isLoading={isLoading}
          openSidebarOnRowClick={true}
        />
      </Card>
    </>
  )
}
