export type ReferralEarning = {
  created_at: string
  amount: number
  user?: {
    id: number
    username?: string
    first_name?: string
    last_name?: string
    telegramID: string
  }
  referral_user?: {
    id: number
    username?: string
    first_name?: string
    last_name?: string
  }
  referal_count?: number
}
