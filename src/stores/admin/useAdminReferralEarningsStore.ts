import { type ReferralEarning } from "@/types/referralEarning"
import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"

interface AdminReferralEarningsState {
  referralEarnings: ReferralEarning[]
  referralEarnings1: ReferralEarning[]
  referralEarnings2: ReferralEarning[]
  referralEarnings3: ReferralEarning[]
  referralEarnings4: ReferralEarning[]
  referralEarnings5: ReferralEarning[]
  isLoading: boolean
  error: string
  fetchReferralEarnings: (level: number) => Promise<void>
  fetchReferralEarningsReferals: (tid: string, level: number) => Promise<void>
  subscribeToReferralEarnings: () => Promise<() => void>
}

const supabase = createClient()

export const useAdminReferralEarningsStore = create<AdminReferralEarningsState>(
  (set) => ({
    referralEarnings: [],
    referralEarnings1: [],
    referralEarnings2: [],
    referralEarnings3: [],
    referralEarnings4: [],
    referralEarnings5: [],
    isLoading: true,
    error: '',

    fetchReferralEarnings: async (level: number) => {

      try {
        const { data: users, error } = await supabase
          .from("users")
          .select("*")
          .filter("referals", "neq", "[]")

        if (error) throw error

        const allReferalIds = Array.from(
          new Set(users.flatMap((u) => u.referals)),
        )
        const { data: referalUsers, error: refError } = await supabase
          .from("users")
          .select(
            "telegramID, userName, created_at, WindBalance, rewardFromClicks, TONRewardFromClicks",
          )
          .in("telegramID", allReferalIds)

        if (refError) throw refError
        const result: ReferralEarning[] = []
        allReferalIds.forEach((id) => {
          const user = users.find((u) => u.referals.includes(id))
          if (user) {
            result.push({
              created_at:
                referalUsers.find((ru) => ru.telegramID === id)?.created_at ||
                new Date().toISOString(),
              amount:
                referalUsers.find((ru) => ru.telegramID === id)
                  ?.rewardFromClicks || 0,
              tonAmount:
                referalUsers.find((ru) => ru.telegramID === id)?.TONRewardFromClicks || 0,
              user: {
                id: user.telegramID,
                username: user.userName || user.telegramID,
                telegramID: user.telegramID,
              },
              referral_user: {
                id: id,
                username:
                  referalUsers.find((ru) => ru.telegramID === id)?.userName ||
                  id,
                first_name: "",
                last_name: "",
              },
              id: user.telegramID || 0,
            })
          }
        })
        if (level === 0) {
          set({ referralEarnings: result || [], isLoading: false })
        }
      } catch (error) {
        console.error("Error fetching referral earnings:", error)
        set({
          error: "Failed to load referral earnings",
          isLoading: false,
        })
      }
    },

    fetchReferralEarningsReferals: async (tid: string, level: number) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("invitedBy", tid)
          .order("created_at", { ascending: false })

        if (error) throw error
        const result: ReferralEarning[] = []
        data.forEach((user) => {
          if (user) {
            result.push({
              created_at:
                user.created_at ||
                new Date().toISOString(),
              amount:
                user.rewardFromClicks || 0,
              tonAmount:
                user.TONRewardFromClicks || 0,
              user: {
                id: user.telegramID,
                username: user.userName || user.telegramID,
                telegramID: user.telegramID,
              },
              referral_user: {
                id: user.invitedBy,
                username:
                  user.userName ||
                  user.id,
                first_name: "",
                last_name: "",
              },
              id: user.telegramID,
            })
          }
        })
        if (level === 1) {
          set({ referralEarnings1: result || [], isLoading: false })
        } else if (level === 2) {
          set({ referralEarnings2: result || [], isLoading: false })
        } else if (level === 3) {
          set({ referralEarnings3: result || [], isLoading: false })
        } else if (level === 4) {
          set({ referralEarnings4: result || [], isLoading: false })
        } else if (level === 5) {
          set({ referralEarnings5: result || [], isLoading: false })
        }
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
      }
    },

    subscribeToReferralEarnings: async () => {
      const channel = supabase
        .channel("referral_earnings_channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
          },
          () => {
            set((state) => {
              state.fetchReferralEarnings(0)
              return state
            })
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    },
  }),
)
