import { Database } from "@/utils/supabase/database.types"

// Базовий тип з бази даних
type UserRow = Database["public"]["Tables"]["users"]["Row"]

// Розширюємо тип для адмін панелі
export type AdminProfile = UserRow & {
  telegramID?: string | null
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
