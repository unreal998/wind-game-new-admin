import { useEffect, useState } from "react"
import { startOfDay, eachDayOfInterval, interval } from "date-fns"
import { fetchTransactionsApi } from "@/app/(cp)/transactions/_components/fetchTransactions"
import { fetchWithdrawalsApi } from "@/app/(cp)/withdrawals/_components/fetchWithdrawal"
import { DateRange } from "react-day-picker"
import { Withdrawal } from "@/stores/admin/useAdminWithdrawalsStore"

type Transaction = {
  id: string
  created_at: string
  summ: number
  uid: string
  wallet: string
  txid: string
}

type DateValue = { date: Date; value: number }

export function useTonBalanceStats(selectedDates: DateRange | undefined) {
  const [tonBalance, setTonBalance] = useState<DateValue[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const transactions: Transaction[] = await fetchTransactionsApi()
      const apiWithdrawals: Withdrawal[] = await fetchWithdrawalsApi()

      // Group transactions by day
      const txByDay: Record<string, number> = {}
      transactions.forEach((tx) => {
        const key = startOfDay(new Date(tx.created_at)).toISOString()
        txByDay[key] = (txByDay[key] || 0) + Number(tx.summ)
      })

      // Group withdrawals by day (using API fields)
      const wdByDay: Record<string, number> = {}
      apiWithdrawals.forEach((wd) => {
        const key = startOfDay(new Date(wd.created_at)).toISOString()
        wdByDay[key] = (wdByDay[key] || 0) + Number(wd.sum)
      })

      // Determine date range
      let from: Date, to: Date
      if (selectedDates?.from && selectedDates?.to) {
        from = startOfDay(selectedDates.from)
        to = startOfDay(selectedDates.to)
      } else {
        const allDates = [...Object.keys(txByDay), ...Object.keys(wdByDay)].map(
          (d) => new Date(d),
        )
        from = allDates.length
          ? new Date(Math.min(...allDates.map((d) => d.getTime())))
          : new Date()
        to = allDates.length
          ? new Date(Math.max(...allDates.map((d) => d.getTime())))
          : new Date()
      }

      const days = eachDayOfInterval(interval(from, to))
      let runningBalance = 0
      const result: DateValue[] = days.map((date) => {
        const key = startOfDay(date).toISOString()
        runningBalance += (txByDay[key] || 0) - (wdByDay[key] || 0)
        return { date, value: runningBalance }
      })

      setTonBalance(result)
    }

    fetchData()
  }, [selectedDates])

  return { tonBalance }
}
