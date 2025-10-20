import { getErrorMessage } from "@/helper/error.helper"
import { AdminRoles } from "@/types/config"
import { createClient } from "@/utils/supabase/client"
import { type SignOut } from "@supabase/supabase-js"
import { create } from "zustand"
import { fetchUserPermissions } from "./admin/useAdminReferralsStore"

const supabase = createClient()

type UserState = {
  user_id: string | null
  profile_id: number | null
  email: string | null
  phone: string | null
  first_name: string | null
  last_name: string | null
  level: number | null
  invite_code: string | null
  usdt_address: string | null
  avatar_url: string | null
  last_ip: string | null
  created_at: string | null
  isLoading: boolean
  role: AdminRoles
}

type UserAction = {
  getCurrentProfileUserAsync: () => Promise<void>
  updateEmailAsync(email: string): Promise<{ error: string } | void>
  updatePasswordAsync(password: string): Promise<{ error: string } | void>
  signOutAsync: (scope?: SignOut["scope"]) => Promise<{ error: string } | void>
  getUserPermissions: () => Promise<void>
  setUserRole: (role: AdminRoles) => void
}
fetchUserPermissions()

const initialState: UserState = {
  role: "marketing",
  user_id: null,
  profile_id: null,
  email: null,
  phone: null,
  first_name: null,
  last_name: null,
  // status: null,
  level: null,
  invite_code: null,
  usdt_address: null,
  avatar_url: null,
  last_ip: null,
  created_at: null,

  isLoading: true,
}

export const useUserStore = create<UserState & UserAction>((set) => ({
  ...initialState,
  setUserRole: (role: AdminRoles) => {
    set({ role })
  },

  async getCurrentProfileUserAsync() {
    try {
      // Отримуємо дані поточного користувача
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw new Error(userError.message)
      if (!userData.user) throw new Error("Користувача не знайдено")

      const newProfileState = {
        email: userData.user.email,
      }

      set(newProfileState)
      console.log("Профіль користувача оновлено:", newProfileState)
      // console.log("Поточний стан профілю:", get());
    } catch (error) {
      console.error("Помилка отримання профілю користувача:", error)
    } finally {
      set({ isLoading: false })
    }
  },
  async getUserPermissions() {
    set({ isLoading: true })
    try {
      const userPermissions = await fetchUserPermissions()
      set({ role: userPermissions.type, isLoading: false })
    } catch (e) {
      console.error("Помилка при отриманні дозволів:", e)
      set({ isLoading: false })
    }
  },

  async updateEmailAsync(email) {
    try {
      const { error } = await supabase.auth.updateUser({ email })
      if (error) throw new Error(error.message)
    } catch (error) {
      console.error("Помилка при оновленні email:", error)
      return { error: getErrorMessage(error as Error) }
    }
  },

  async updatePasswordAsync(password) {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw new Error(error.message)
    } catch (error) {
      console.error("Помилка при оновленні пароля:", error)
      return { error: getErrorMessage(error as Error) }
    }
  },

  async signOutAsync(scope = "local") {
    const message = {
      success: {
        local: "Successfully logged out.",
        global: "Successfully logged out all device",
        others: "Successfully logged out other device",
      },
      error: {
        local: "Something went wrong! Failed to log out",
        global: "Something went wrong! Failed to log out all device",
        others: "Something went wrong! Failed to log out other device",
      },
    }

    try {
      const { error } = await supabase.auth.signOut({ scope })
      if (error) throw new Error(error.message)
      window.location.reload()
    } catch (error) {
      console.error("Помилка при виході з системи:", error)
      return { error: message.error[scope] }
    }
  },
}))

export const roleSelector = (state: UserState & UserAction) => state.role
