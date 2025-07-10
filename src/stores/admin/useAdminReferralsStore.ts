import { AdminProfile } from "@/types/profile"
import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"
import { GetPermissionsDto } from "./useAdminPermissionsStore"

interface AdminReferralsState {
  profiles: AdminProfile[]
  isLoading: boolean
  error: string | null
  fetchProfiles: () => Promise<void>
  updateUser: (updatedUser: AdminProfile) => void
  subscribeToProfiles: () => Promise<() => void>
}

const supabase = createClient()

export const useAdminReferralsStore = create<AdminReferralsState>(
  (set, get) => ({
    profiles: [],
    isLoading: true,
    error: null,

    fetchProfiles: async () => {
      // set({ isLoading: true, error: null });
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        set({
          profiles: data || [],
          isLoading: false,
        })
      } catch (error) {
        console.error("Error fetching profiles:", error)
        set({ error: "Failed to load profiles", isLoading: false })
      }
    },

    subscribeToProfiles: async () => {
      const subscription = supabase
        .channel("users_channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
          },
          () => {
            get().fetchProfiles()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    },
    updateUser: (updatedUser) => {
      set((state) => ({
        profiles: state.profiles.map((u) =>
          u.id === updatedUser.id ? updatedUser : u,
        ),
      }))
    },
  }),
)

export async function fetchUserPermissions(): Promise<GetPermissionsDto> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userEmail = user?.email || ""
  try {
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .eq("email", userEmail)
      .single()

    if (error) throw error
    console.log("=======", data)
    return data
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    throw error
  }
}
