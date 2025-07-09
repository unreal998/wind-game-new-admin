import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"

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

interface AdminPermissionsState {
  permissions: GetPermissionsDto[]
  isLoading: boolean
  error: string | null
  fetchPermissions: () => Promise<void>
  createPermission: (permissionData: CreatePermissionDto) => Promise<void>
}

const supabase = createClient()

export const useAdminPermissionsStore = create<AdminPermissionsState>(
  (set) => ({
    permissions: [],
    isLoading: false,
    error: null,
    createPermission: async (permissionData: CreatePermissionDto) => {
      set({ isLoading: true })
      try {
        const { error } = await supabase
          .from("permissions")
          .insert(permissionData)
        if (error) throw error

        const { data, error: fetchError } = await supabase
          .from("permissions")
          .select("*")
        if (fetchError) throw fetchError

        console.log(data)
        set({ permissions: data, isLoading: false })
      } catch (e) {
        console.error("Error when creating permissions", e)
        set({ error: "Error when creating permissions", isLoading: false })
      }
    },
    fetchPermissions: async () => {
      set({ isLoading: true })
      try {
        const { data: permissionsData, error } = await supabase
          .from("permissions")
          .select("*")
        if (error) throw error
        console.log(permissionsData)
        set({ permissions: permissionsData, isLoading: false })
      } catch (e) {
        set({ error: "Error when fetching permissions", isLoading: false })
      }
    },
  }),
)
