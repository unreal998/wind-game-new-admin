import { AdminProfile } from "@/types/profile"
import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"
import { GetPermissionsDto } from "./useAdminPermissionsStore"
import { DateRange } from "react-day-picker"
import { endOfDay, format, startOfDay } from "date-fns"

interface AdminReferralsState {
  profiles: AdminProfile[]
  marketingProfiles: AdminProfile[]
  isLoading: boolean
  error: string | null
  fetchProfiles: () => Promise<void>
  updateUser: (updatedUser: AdminProfile) => void
  subscribeToProfiles: () => Promise<() => void>
  fetchMarketingProfiles: (tid: string) => Promise<void>
  fetchMarketingReferalsProfiles: (tid: string) => Promise<void>
  fetchKWTBalance: (selectedDates?: DateRange) => Promise<number>
  fethTonBalance: (selectedDates?: DateRange) => Promise<number>
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

    fetchProfiles: async () => {
      try {
        const PAGE_SIZE = 1000;
        let allUsers: any[] = [];
        let from = 0;
        let hasMore = true;

        while (hasMore) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false })
            .range(from, from + PAGE_SIZE - 1);

          if (error) throw error;

          allUsers = allUsers.concat(data);
          hasMore = data.length === PAGE_SIZE;
          from += PAGE_SIZE;
        }

        set({ profiles: allUsers, isLoading: false });
      } catch (error) {
        console.error("Error fetching profiles:", error)
        set({ error: "Failed to load profiles", isLoading: false })
      }
    },

    fetchMarketingProfiles: async (team: string) => {

      try {
        const PAGE_SIZE = 1000;
        let allUsers: any[] = [];
        let from = 0;
        let hasMore = true;
        const teamArray = [team];
        teamArray.push('ran');
        while (hasMore) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .in("team", teamArray)
            .order("created_at", { ascending: false })
            .range(from, from + PAGE_SIZE - 1);

            if (error) throw error;

            allUsers = allUsers.concat(data);
            hasMore = data.length === PAGE_SIZE;
            from += PAGE_SIZE;
        }

        set({ marketingProfiles: allUsers, isLoading: false });
      } catch (error) {
        console.error("Error fetching profiles:", error)
        set({ error: "Failed to load profiles", isLoading: false })
      }
    },

    fetchMarketingReferalsProfiles: async (tid: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("invitedBy", tid)
          .limit(6000) 
          .order("created_at", { ascending: false })

        if (error) throw error

        set({ marketingReferalsProfiles: data || [] })
      } 
      catch (error) {
        console.error("Error fetching marketing profiles:", error)
        set({ error: "Failed to load marketing profiles" })
      }
    },

    fetchKWTBalance: async (selectedDates?: DateRange) => {
      const supabase = createClient();
      if (!selectedDates?.from || !selectedDates?.to) return;

      const fromDate = startOfDay(selectedDates.from);
      const toDate = endOfDay(selectedDates.to);

      const fromStr = format(fromDate, "yyyy-MM-dd HH:mm:ss");
      const toStr = format(toDate, "yyyy-MM-dd HH:mm:ss");

      let allData: any[] = [];
      let fromIndex = 0;
      let toIndex = 999;

      while (true) {
          const { data, error } = await supabase
            .from("turx_dynamic")
            .select("*")
            .gte("created_at", fromStr)
            .lte("created_at", toStr)
            .order("created_at", { ascending: true })
            .range(fromIndex, toIndex);

          if (error) {
            console.error("Error fetching registration stats:", error);
            break;
          }

          allData = allData.concat(data);
          if (data.length < 1000) break;

          fromIndex += 1000;
          toIndex += 1000;
      }
      return allData[allData.length - 1].sum;
    },

    fethTonBalance: async (selectedDates?: DateRange) => {
      const withdrawalsBalance = await fetchWithdrawalsBalance(selectedDates);
      const transactionsBalance = await fetchTransactionsBalance(selectedDates);
      return transactionsBalance - withdrawalsBalance;
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

export async function fetchUserDataByTid(tid: string): Promise<AdminProfile> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("telegramID", tid)
    .single()
  if (error) throw error
  return data
}

export const fetchWithdrawalsBalance = async (selectedDates?: DateRange) => {
  const supabase = createClient();
  if (!selectedDates?.from || !selectedDates?.to) return;
  const fromDate = startOfDay(selectedDates.from);
  const toDate = endOfDay(selectedDates.to);

  const fromStr = format(fromDate, "yyyy-MM-dd HH:mm:ss");
  const toStr = format(toDate, "yyyy-MM-dd HH:mm:ss");

  let allData: any[] = [];
  let fromIndex = 0;
  let toIndex = 999;

  while (true) {
      const { data, error } = await supabase
        .from("withdraw")
        .select("*")
        .gte("created_at", fromStr)
        .lte("created_at", toStr)
        .order("created_at", { ascending: true })
        .range(fromIndex, toIndex);

      if (error) {
        console.error("Error fetching registration stats:", error);
        break;
      }

      allData = allData.concat(data);
      if (data.length < 1000) break;

      fromIndex += 1000;
      toIndex += 1000;
  }

  return allData.filter((item) => item.status === "completed").reduce((acc, item) => acc + item.sum, 0);
};

export const fetchTransactionsBalance = async (selectedDates?: DateRange) => {
  const supabase = createClient();
  if (!selectedDates?.from || !selectedDates?.to) return;

  const fromDate = startOfDay(selectedDates.from);
  const toDate = endOfDay(selectedDates.to);

  const fromStr = format(fromDate, "yyyy-MM-dd HH:mm:ss");
  const toStr = format(toDate, "yyyy-MM-dd HH:mm:ss");

  let allData: any[] = [];
  let fromIndex = 0;
  let toIndex = 999;

  while (true) {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .gte("created_at", fromStr)
        .lte("created_at", toStr)
        .order("created_at", { ascending: true })
        .range(fromIndex, toIndex);

      if (error) {
        console.error("Error fetching registration stats:", error);
        break;
      }

      allData = allData.concat(data);
      if (data.length < 1000) break;

      fromIndex += 1000;
      toIndex += 1000;
  }
  return allData.filter((item) => item.txid !== "312r2r12f12r12f12fqwfh55h5h" && item.txid !== "1w23uui8890bbh1y7u9it5r2cv2g").reduce((acc, item) => acc + item.summ, 0);
}
