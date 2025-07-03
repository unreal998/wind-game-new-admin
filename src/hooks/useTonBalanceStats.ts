import { useEffect, useState } from "react"
import { startOfDay, eachDayOfInterval, isWithinInterval } from "date-fns"
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

      let from: Date, to: Date
      if (selectedDates?.from && selectedDates?.to) {
        from = startOfDay(selectedDates.from)
        to = startOfDay(selectedDates.to)
      } else {
        const allDates = [
          ...transactions.map((tx) => startOfDay(new Date(tx.created_at))),
          ...apiWithdrawals.map((wd) => startOfDay(new Date(wd.created_at))),
        ]
        if (allDates.length) {
          from = new Date(Math.min(...allDates.map((d) => d.getTime())))
          to = new Date(Math.max(...allDates.map((d) => d.getTime())))
        } else {
          from = to = startOfDay(new Date())
        }
      }

      const isInRange = (date: Date) =>
        isWithinInterval(date, { start: from, end: to })

      const filteredTx = transactions.filter((tx) =>
        isInRange(startOfDay(new Date(tx.created_at))),
      )
      const filteredWd = apiWithdrawals
        .filter((wd) => isInRange(startOfDay(new Date(wd.created_at))))
        .filter((wd) => wd.status === "completed")

      // Group by day
      const txByDay: Record<string, number> = {}
      filteredTx.forEach((tx) => {
        const key = startOfDay(new Date(tx.created_at)).toISOString()
        txByDay[key] = (txByDay[key] || 0) + Number(tx.summ)
      })

      const wdByDay: Record<string, number> = {}
      filteredWd.forEach((wd) => {
        const key = startOfDay(new Date(wd.created_at)).toISOString()
        wdByDay[key] = (wdByDay[key] || 0) + Number(wd.sum)
      })

      const days = eachDayOfInterval({ start: from, end: to })
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
