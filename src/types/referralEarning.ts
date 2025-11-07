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
  referalCount?: number
  inactiveReferalCount?: number
  windBalance?: number
  tonAmount?: number
  referalIncomeTON?: number
  id: number
}
