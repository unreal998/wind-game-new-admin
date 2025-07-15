import { createClient } from "@/utils/supabase/client"
import axios from "axios"
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
  updatePermission: (
    permissionData: UpdatePermissionDto,
    id: GetPermissionsDto["id"],
  ) => Promise<void>
  deletePermission: (id: GetPermissionsDto["id"]) => Promise<void>
}

const supabase = createClient()
const SERVER_URL = process.env.SERVER_URL

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
    updatePermission: async (
      permissionData: UpdatePermissionDto,
      id: GetPermissionsDto["id"],
    ) => {
      try {
        const { data } = await axios.put(
          `${SERVER_URL}/permissions?id=${id}`,
          permissionData,
        )
        if (data.error) {
          set({ error: data.error })
        }

        set((state) => {
          return {
            permissions: state.permissions.map((perm) => {
              if (perm.id === id) {
                return { ...perm, ...permissionData }
              }
              return perm
            }),
          }
        })
      } catch (e: any) {
        console.log("UPDATING PERMISSION ERROR", e)
        set({ error: `error when updating permission with id:${id}` })
      } finally {
        set({ isLoading: false })
      }
    },
    deletePermission: async (id: GetPermissionsDto["id"]) => {
      try {
        const {  error } = await supabase.from("permissions").delete().eq("id", id)
      } catch (e: any) {
        console.log("DELETING PERMISSION ERROR", e)
        set({ error: `error when deleting permission with id:${id}` })
      }
    }
  }),
)
