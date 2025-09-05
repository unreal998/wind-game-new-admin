import { AdminProfile } from "@/types/profile"
import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"
import { GetPermissionsDto } from "./useAdminPermissionsStore"

interface AdminReferralsState {
  profiles: AdminProfile[]
  marketingProfiles: AdminProfile[]
  isLoading: boolean
  error: string | null
  fetchProfiles: () => Promise<void>
  updateUser: (updatedUser: AdminProfile) => void
  subscribeToProfiles: () => Promise<() => void>
  fetchMarketingProfiles: (tid: string) => Promise<void>
  marketingSubReferalsProfiles: AdminProfile[]
  marketingSubReferalsProfiles3: AdminProfile[]
  marketingSubReferalsProfiles4: AdminProfile[]
  marketingSubReferalsProfiles5: AdminProfile[]
  fetchMarketingReferalsProfiles: (tid: string) => Promise<void>
  fetchMarketingSubReferalsProfiles: (tid: string) => Promise<void>
  fetchMarketingSubReferalsProfiles3: (tid: string) => Promise<void>
  fetchMarketingSubReferalsProfiles4: (tid: string) => Promise<void>
  fetchMarketingSubReferalsProfiles5: (tid: string) => Promise<void>
  marketingReferalsProfiles: AdminProfile[]
}

const supabase = createClient()

export const useAdminReferralsStore = create<AdminReferralsState>(
  (set, get) => ({
    profiles: [],
    isLoading: true,
    error: null,
    marketingProfiles: [],
    marketingReferalsProfiles: [],
    marketingSubReferalsProfiles: [],
    marketingSubReferalsProfiles3: [],
    marketingSubReferalsProfiles4: [],
    marketingSubReferalsProfiles5: [],

    fetchProfiles: async () => {
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

    fetchMarketingProfiles: async (tid: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("invitedBy", tid)
          .order("created_at", { ascending: false })

        if (error) throw error

        set({ marketingProfiles: data || [] })
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
      }
    },

    fetchMarketingReferalsProfiles: async (tid: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("invitedBy", tid)
          .order("created_at", { ascending: false })

        if (error) throw error

        set({ marketingReferalsProfiles: data || [] })
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
      }
    },

    fetchMarketingSubReferalsProfiles: async (tid: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("invitedBy", tid)
          .order("created_at", { ascending: false })

        if (error) throw error

        set({ marketingSubReferalsProfiles: data || [] })
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
      }
    },

    fetchMarketingSubReferalsProfiles3: async (tid: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("invitedBy", tid)
          .order("created_at", { ascending: false })

        if (error) throw error

        set({ marketingSubReferalsProfiles3: data || [] })
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
      }
    },

    fetchMarketingSubReferalsProfiles4: async (tid: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("invitedBy", tid)
          .order("created_at", { ascending: false })

        if (error) throw error

        set({ marketingSubReferalsProfiles4: data || [] })
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
      }
    },

    fetchMarketingSubReferalsProfiles5: async (tid: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("invitedBy", tid)
          .order("created_at", { ascending: false })

        if (error) throw error

        set({ marketingSubReferalsProfiles5: data || [] })
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
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
    return data
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    throw error
  }
}
