import {
  fetchUpdateWithDrawStatus,
  fetchWithdrawalsApi,
} from "@/app/(cp)/withdrawals/_components/fetchWithdrawal"
import { create } from "zustand"

type WithdrawalRequestStatus = "new" | "completed" | "declined"

type Withdrawal = {
  id: string
  uid: string
  tid: number
  created_at: string
  status: WithdrawalRequestStatus
  sum: number
  wallet: string
  memo: number | string | null
}

interface AdminWithdrawalsState {
  withdrawals: Withdrawal[]
  isLoadingWithDrawal: boolean
  error: string | null
  newWithdrawalsCount: number | null
  setNewWithdrawalsCount: (newCount: number) => void
  fetchWithdrawals: () => Promise<void>
  updateWithdrawals: () => Promise<void>
  updateWithDrawStatus: (
    id: string,
    status: "completed" | "declined",
  ) => Promise<void>
}

export const useAdminWithdrawalsStore = create<AdminWithdrawalsState>(
  (set) => ({
    withdrawals: [],
    newWithdrawalsCount: null,
    isLoadingWithDrawal: true,
    error: null,
    setNewWithdrawalsCount: (newCount: number) =>
      set({ newWithdrawalsCount: newCount }),
    fetchWithdrawals: async () => {
      set({ isLoadingWithDrawal: true })
      try {
        const withdrawals: Withdrawal[] = await fetchWithdrawalsApi()
        set({ withdrawals: withdrawals || [], isLoadingWithDrawal: false })
      } catch (error) {
        console.error("Error fetching locations:", error)
        set({ error: "Failed to load locations", isLoadingWithDrawal: false })
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
