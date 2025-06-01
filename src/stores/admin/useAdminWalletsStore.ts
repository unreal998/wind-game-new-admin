import { type Wallet } from "@/types/wallet"
import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"

interface AdminWalletsState {
  wallets: Wallet[]
  isLoading: boolean
  error: string | null
  fetchWallets: () => Promise<void>
  subscribeToWallets: () => Promise<() => void>
}

const supabase = createClient()

export const useAdminWalletsStore = create<AdminWalletsState>((set) => ({
  wallets: [],
  isLoading: true,
  error: null,

  fetchWallets: async () => {
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select(`
          *,
          user:users!wallets_user_id_fkey (
            id,
            first_name,
            last_name,
            username,
            status,
            wallet,
            wallet_ton
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      set({ wallets: data || [], isLoading: false })
    } catch (error) {
      console.error("Error fetching wallets:", error)
      set({ error: "Failed to load wallets", isLoading: false })
    }
  },

  subscribeToWallets: async () => {
    const channel = supabase
      .channel("wallets_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallets",
        },
        () => {
          set((state) => {
            state.fetchWallets()
            return state
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
})) 