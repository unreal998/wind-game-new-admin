import axios from "axios"

export type AdminPermissions = "read" | "write"

export type CreatePermissionDto = {
  email: string
  type: "admin" | "teamlead" | "guest"
  permissions: AdminPermissions[]
}

export type GetPermissionsDto = CreatePermissionDto & {
  id: number
  created_at: string
}

export type UpdatePermissionDto = Partial<CreatePermissionDto>

export const fetchCreatePermission = async (
  missionData: CreatePermissionDto,
) => {
  const response = await axios.post(
    `https://2565-95-164-85-150.ngrok-free.app/permissions`,
    missionData,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data
}
export const fetchUpdatePermission = async (
  permissionId: number,
  missionData: UpdatePermissionDto,
) => {
  const response = await axios.put(
    `https://2565-95-164-85-150.ngrok-free.app/permissions?id=${permissionId}`,
    missionData,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data
}
export const fetchGetPermissions = async (): Promise<GetPermissionsDto> => {
  const response = await axios.get(
    `https://2565-95-164-85-150.ngrok-free.app/permissions`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data
}

export const fetchDeletePermission = async (permissionId: number) => {
  const response = await axios.delete(
    `https://2565-95-164-85-150.ngrok-free.app/permissions?id=${permissionId}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data
}
