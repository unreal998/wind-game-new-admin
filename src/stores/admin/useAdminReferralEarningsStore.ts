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
  isLoadingEarnings1: boolean
  isLoadingEarnings2: boolean
  isLoadingEarnings3: boolean
  isLoadingEarnings4: boolean
  isLoadingEarnings5: boolean
  error: string
  fetchReferralEarnings: () => Promise<void>
  fetchReferralEarningsReferals: (tid: string, level: number, ownersData?: ReferralEarning) => Promise<any[]>
  subscribeToReferralEarnings: () => Promise<() => void>
  fetchReferralStats: () => Promise<{ tonData: number, kwtData: number }>
  searchReferralEarnings: (search: string) => Promise<any[]>
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
    isLoadingEarnings1: true,
    isLoadingEarnings2: true,
    isLoadingEarnings3: true,
    isLoadingEarnings4: true,
    isLoadingEarnings5: true,
    error: '',

    fetchReferralEarnings: async () => {
      set({ isLoading: true })
      const PAGE_SIZE = 1000;
      let allUsers: any[] = [];
      let from = 0;
      let hasMore = true;
      try {
        while (hasMore) {
          const { data: users, error } = await supabase
          .from("users")
          .select("*")
          .or('telegramID.eq.875867810,telegramID.eq.399678680,telegramID.eq.6668721056,team.eq.ran')
          .filter("referals->0", "not.is", null)
          .range(from, from + PAGE_SIZE - 1)


          if (error) throw error
          allUsers = allUsers.concat(users)
          hasMore = users.length === PAGE_SIZE
          from += PAGE_SIZE

        }

        const result: ReferralEarning[] = []

        for (const user of allUsers) {
          let referalCount = 0;
          let allReferalsCount = 0;
          if (user?.referals?.length > 0) {
            referalCount = await getUsersByIds(user.referals)
            allReferalsCount = await getAllReferalsCount(user.telegramID)
          }

          if (user) {
            result.push({
              created_at:
                user.created_at ||
                new Date().toISOString(),
              amount:
                referalCount > 0 ? Math.floor(Object.values(user.referalIncomeKWT).reduce((a: number, v) => a + Number(v || 0), 0) * 10000) / 10000 : 0,
              tonAmount:
                referalCount > 0 ? Math.floor(Object.values(user.referalIncomeTON).reduce((a: number, v) => a + Number(v || 0), 0) * 10000) / 10000 : 0,
              user: {
                id: user.telegramID,
                username: user.userName || user.telegramID,
                telegramID: user.telegramID,
              },
              referalCount: referalCount,
              allReferalsCount: allReferalsCount,
              inactiveReferalCount: user.referals?.length - referalCount,
              referral_user: {
                id: user.invitedBy,
                username: '',
                first_name: "",
                last_name: "",
              },
              id: user.telegramID,
            })
          }
        } 
            set({ referralEarnings: result || [], isLoading: false })
        } catch (error) {
          console.error("Error fetching referral earnings:", error)
          set({
            error: "Failed to load referral earnings",
            isLoading: false,
          })
        }
    },

    fetchReferralEarningsReferals: async (tid: string, level: number, ownersData?: ReferralEarning): Promise<any[]> => {
      let allReferals: any[] = []
      if (level === 1) {
        set({ isLoadingEarnings1: true, referralEarnings1: [] })
      } else if (level === 2) {
        set({ isLoadingEarnings2: true, referralEarnings2: [] })
      } else if (level === 3) {
        set({ isLoadingEarnings3: true, referralEarnings3: [] })
      } else if (level === 4) {
        set({ isLoadingEarnings4: true, referralEarnings4: [] })
      } else if (level === 5) {
        set({ isLoadingEarnings5: true, referralEarnings5: [] })
      }
      try {
        let from = 0
        let hasMore = true
        const PAGE_SIZE = 1000
        while (hasMore) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("invitedBy", tid)
            .order("created_at", { ascending: false })
            .range(from, from + PAGE_SIZE - 1)
            if (error) throw error
            allReferals = allReferals.concat(data)
            hasMore = data.length === PAGE_SIZE
            from += PAGE_SIZE
        }

        const result: ReferralEarning[] = []

         for (const user of allReferals) {
          let referalCount = 0;
          let allReferalsCount = 0;
            if (user?.referals?.length > 0) {
              referalCount = await getUsersByIds(user.referals)
              allReferalsCount = await getAllReferalsCount(user.telegramID)
            }

          if (user) {
            result.push({
              created_at:
                user.created_at ||
                new Date().toISOString(),
                amount:
                  referalCount > 0 ? Math.floor(Object.values(user.referalIncomeKWT).reduce((a: number, v) => a + Number(v || 0), 0) * 10000) / 10000 : 0,
               tonAmount:
                  referalCount > 0 ? Math.floor(Object.values(user.referalIncomeTON).reduce((a: number, v) => a + Number(v || 0), 0) * 10000) / 10000 : 0,
              user: {
                id: user.telegramID,
                username: user.userName || user.telegramID,
                telegramID: user.telegramID,
              },
              referalCount: referalCount,
              allReferalsCount: allReferalsCount,
              inactiveReferalCount: user.referals?.length - referalCount,
              referral_user: {
                id: user.invitedBy,
                username: ownersData?.user?.username || user.invitedBy,
                first_name: "",
                last_name: "",
              },
              id: user.telegramID,
            })
          }
        } 
 
        if (level === 1) {
          set({ referralEarnings1: result || [], isLoadingEarnings1: false })
        } else if (level === 2) {
          set({ referralEarnings2: result || [], isLoadingEarnings2: false })
        } else if (level === 3) {
          set({ referralEarnings3: result || [], isLoadingEarnings3: false })
        } else if (level === 4) {
          set({ referralEarnings4: result || [], isLoadingEarnings4: false })
        } else if (level === 5) {
          set({ referralEarnings5: result || [], isLoadingEarnings5: false })
        } else if (level === 0) {
          set({ referralEarnings: result || [], isLoading: false })

        }
        return result
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
        return []
      }
    },

    fetchReferralStats: async () => {
      const { data: tonData, error: tonError } = await supabase.rpc("get_total_referal_income_ton");
      const { data: kwtData, error: kwtError } = await supabase.rpc("get_total_referal_income_kwt");
      if (tonError) throw tonError
      if (kwtError) throw kwtError
      return { tonData: tonData[0].total_sum, kwtData: kwtData[0].total_sum }
    },

    searchReferralEarnings: async (search: string) => {
      const { data, error } = await supabase.rpc("get_referral_parents_array", {
        target_tid: search
      })
      if (error) throw error
      return data
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
              state.fetchReferralEarnings()
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
export async function getUsersByIds(uids: string[]) {
  const CHUNK_SIZE = 1000;
  const PAGE_SIZE = 1000;
  let allUsers: any[] = [];

  // делим массив uids на чанки по 1000
  for (let i = 0; i < uids.length; i += CHUNK_SIZE) {
    const chunk = uids.slice(i, i + CHUNK_SIZE);
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .in("telegramID", chunk)
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;

      allUsers = allUsers.concat(data);
      hasMore = data.length === PAGE_SIZE;
      from += PAGE_SIZE;
    }
  }

  return allUsers.length;
}

export async function getAllReferalsCount(tid: string) {
  const { data, error } = await supabase
  .rpc("get_referral_children_count", {
    target_tid: tid
  })
  if (error) throw error
  return data;
}