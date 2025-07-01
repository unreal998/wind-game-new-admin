import { useEffect, useState } from "react"
import { startOfDay } from "date-fns"
import { createClient } from "@/utils/supabase/client"
import { type ReferralEarning } from "@/types/referralEarning"

type DateValue = { date: Date; value: number }

export function useReferalsStats() {
  const [referals, setReferals] = useState<DateValue[]>([])

  useEffect(() => {
    const fetchReferals = async () => {
      const supabase = createClient()
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .filter("referals", "neq", "[]")

      if (error) {
        console.error("Error fetching referals:", error)
        return
      }

      const referalEarnings: ReferralEarning[] = []
      users.forEach((user: any) => {
        if (Array.isArray(user.referals)) {
          user.referals.forEach((refId: string) => {
            referalEarnings.push({
              created_at: user.created_at,
              amount: 1,
              user: {
                id: user.telegramID,
                username: user.userName || user.telegramID,
                telegramID: user.telegramID,
              },
              referral_user: {
                id: Number(refId),
                username: "",
                first_name: "",
                last_name: "",
              },
            })
          })
        }
      })

      const grouped = referalEarnings.reduce<Record<string, number>>((acc, item) => {
        const key = startOfDay(new Date(item.created_at)).toISOString()
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const formatted: DateValue[] = Object.entries(grouped).map(
        ([date, value]) => ({
          date: new Date(date),
          value,
        }),
      )

      setReferals(formatted)
    }

    fetchReferals()
  }, [])

  return { referals }
}