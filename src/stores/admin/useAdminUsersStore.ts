import { create } from "zustand"
import { AdminUser } from "@/types/admin"
import { AdminRoles } from "@/types/config"
import { createClient } from "@/utils/supabase/client"
import { updateAdminRole, removeAdminRole } from "@/actions/admins"

const supabase = createClient()

interface AdminUsersState {
  users: AdminUser[]
  isLoading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  subscribeToUsers: () => Promise<() => void>
  updateRole: (userId: string, role: AdminRoles) => Promise<void>
  removeRole: (userId: string) => Promise<void>
}

export const useAdminUsersStore = create<AdminUsersState>((set) => ({
  users: [],
  isLoading: true,
  error: null,

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const { data, error } = await supabase
        .from('admin_users_view')
        .select('*')
      
      if (error) throw error
      
      set({ users: data, isLoading: false })
    } catch (error) {
      console.error('Error fetching users:', error)
      set({ 
        error: 'Failed to fetch users',
        isLoading: false 
      })
    }
  },

  subscribeToUsers: async () => {
    const channel = supabase
      .channel('admin_users_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_users_view'
        },
        () => {
          set((state) => {
            state.fetchUsers()
            return state
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  updateRole: async (userId: string, role: AdminRoles) => {
    try {
      await updateAdminRole(userId, role)
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId 
            ? { 
                ...user, 
                raw_user_meta_data: {
                  ...user.raw_user_meta_data,
                  role
                }
              } 
            : user
        ),
      }))
    } catch (error) {
      console.error('Error updating role:', error)
      throw error
    }
  },

  removeRole: async (userId: string) => {
    try {
      await removeAdminRole(userId)
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId)
      }))
    } catch (error) {
      console.error('Error removing role:', error)
      throw error
    }
  },
})) 