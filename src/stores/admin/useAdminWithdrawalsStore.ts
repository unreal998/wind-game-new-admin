import {
  fetchUpdateWithDrawStatus
} from "@/app/(cp)/withdrawals/_components/fetchWithdrawal"
import { createClient } from "@/utils/supabase/client"
import { format } from "date-fns-tz"
import { DateRange } from "react-day-picker"
import { create } from "zustand"

type WithdrawalRequestStatus = "new" | "completed" | "declined"

export type Withdrawal = {
  id: string
  uid: string
  tid: number
  created_at: string
  status: WithdrawalRequestStatus
  sum: number
  wallet: string
  MEMO: number | string | null
}

interface AdminWithdrawalsState {
  withdrawals: Withdrawal[]
  allWithdrawals: Withdrawal[]
  isLoadingWithDrawal: boolean
  error: string | null
  newWithdrawalsCount: number | null
  fetchWithdrawals: (selectedDateRange?: DateRange) => Promise<void>
  updateWithdrawals: () => Promise<void>
  updateWithDrawStatus: (
    id: string,
    status: "completed" | "declined",
  ) => Promise<void>
}

async function getAllWithdrawals() {
  const supabase = createClient();
  let allData: any[] = [];
  let fromIndex = 0;
  let toIndex = 999;

  while (true) {
    const { data, error } = await supabase
      .from("withdraw")
      .select("*")
      .order("created_at", { ascending: true })
      .range(fromIndex, toIndex);

    if (error) {
      console.error("Error fetching withdrawals:", error);
      break;
    }

    allData = allData.concat(data);
    if (data.length < 1000) break;

    fromIndex += 1000;
    toIndex += 1000;
  }
  return allData;
}

export const useAdminWithdrawalsStore = create<AdminWithdrawalsState>(
  (set) => ({
    withdrawals: [],
    newWithdrawalsCount: null,
    isLoadingWithDrawal: true,
    error: null,
    allWithdrawals: [],
    

    fetchWithdrawals: async (selectedDateRange?: DateRange) => {
      const supabase = createClient();
      set({ isLoadingWithDrawal: true })
      try {
        let allData: any[] = [];
        let fromIndex = 0;
        let toIndex = 999;

        while (true) {
          const { data, error } = await supabase
            .from("withdraw")
            .select("*")
            .gte("created_at", format(selectedDateRange?.from as Date, "yyyy-MM-dd HH:mm:ss"))
            .lte("created_at", format(selectedDateRange?.to as Date, "yyyy-MM-dd HH:mm:ss"))
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
        const allWithdrawals = await getAllWithdrawals();
        set({
          withdrawals: allData || [],
          newWithdrawalsCount: allData.filter((w) => w.status === "new")
            .length,
          isLoadingWithDrawal: false,
          allWithdrawals: allWithdrawals || [],
        })
      } catch (error) {
        console.error("Error fetching withdrawals:", error)
        set({ error: "Failed to load withdrawals", isLoadingWithDrawal: false })
      }
    },


    updateWithDrawStatus: async (
      id: string,
      status: "completed" | "declined",
    ) => {
      await fetchUpdateWithDrawStatus({ id, status })
      set((state) => ({
        withdrawals: state.withdrawals.map((withdrawal) => {
          return withdrawal.id === id ? { ...withdrawal, status } : withdrawal
        }),
      }))
    },

    updateWithdrawals: async () => {},
  }),
)
