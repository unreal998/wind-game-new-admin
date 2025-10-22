import { Database } from "@/utils/supabase/database.types"

// Базовий тип з бази даних
type UserRow = Database["public"]["Tables"]["users"]["Row"]

export const adminProfileTeams = ["a", "i", "ran", "t"] as const
export type AdminProfileTeams = (typeof adminProfileTeams)[number]

// Розширюємо тип для адмін панелі
export type AdminProfile = UserRow & {
  telegramID?: string | null
  referalCount?: number
  team?: AdminProfileTeams
}

export interface TransactionProfile {
  id: number
  username?: string
  first_name?: string
  last_name?: string
  status: string
  wallet?: string
  wallet_ton?: string
}
