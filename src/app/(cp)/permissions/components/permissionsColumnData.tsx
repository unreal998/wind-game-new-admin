import { CopyButton } from "@/components/CopyButton"
import {
  AdminPermissions,
  GetPermissionsDto,
} from "@/stores/admin/useAdminPermissionsStore"
import { TableColumn } from "@/types/table"
import { createColumnHelper } from "@tanstack/react-table"
import PermissionsActions from "./PermissionsActions"

const columnHelper = createColumnHelper<GetPermissionsDto>()

export const getPermissionColumns = (
  isAvailableToWrite: boolean,
): TableColumn<GetPermissionsDto>[] => {
  let permissionColumns: TableColumn<GetPermissionsDto>[] = [
    columnHelper.accessor("created_at", {
      header: "created at",
      cell: ({ getValue }) => {
        const created_at = getValue()
        if (!created_at) return "-"
        return (
          <span className="flex items-center space-x-2">
            <span>{created_at}</span>
            <CopyButton text={created_at} />
          </span>
        )
      },
    }),

    columnHelper.accessor("type", {
      header: "type",
      cell: ({ getValue }) => {
        const type = getValue()
        if (!type) return "-"
        return (
          <span className="flex items-center space-x-2">
            <span>{type}</span>
            <CopyButton text={type} />
          </span>
        )
      },
    }),
    columnHelper.accessor("email", {
      header: "email",
      cell: ({ getValue }) => {
        const email = getValue()
        if (!email) return "-"
        return (
          <span className="flex items-center space-x-2">
            <span>{email}</span>
            <CopyButton text={email} />
          </span>
        )
      },
    }),
    columnHelper.accessor("permissions", {
      header: "permissions",
      cell: ({ getValue }) => {
        const permissions: AdminPermissions[] = getValue()
        if (!permissions) return "-"
        return (
          <span className="flex items-center space-x-2">
            {permissions.map((permission) => (
              <span key={permissions.indexOf(permission)}>{permission}</span>
            ))}
          </span>
        )
      },
    }),
  ]
  if (isAvailableToWrite) {
    permissionColumns.push(
      columnHelper.display({
        id: "actions",
        header: "actions",
        cell: ({ row }) => {
          return <PermissionsActions permission={row.original} />
        },
      }),
    )
  }
  return permissionColumns
}
