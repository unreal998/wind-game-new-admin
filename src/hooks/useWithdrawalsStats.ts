import { useEffect, useState } from "react"
import { startOfDay, interval, isWithinInterval, subDays } from "date-fns"
import axios from "axios"
import { DateRange } from "react-day-picker"

type Withdrawal = {
  created_at: string
  sum: number
  status: string
}

export type DateValue = { date: Date; value: number }

export function useWithdrawalsStats(selectedDates: DateRange | undefined) {
  const [data, setData] = useState<DateValue[]>([])
  const [currentTotal, setCurrentTotal] = useState<number>(0)
  const [previousTotal, setPreviousTotal] = useState<number>(0)

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get(
          "https://2565-95-164-85-150.ngrok-free.app/withdraw/all",
          {
            headers: {
              "ngrok-skip-browser-warning": true,
            },
          },
        )

        const rawData: Withdrawal[] = response.data.data

        const grouped = rawData.reduce<Record<string, number>>((acc, item) => {
          const key = startOfDay(new Date(item.created_at)).toISOString()
          if (item.status === 'completed') {
            acc[key] = (acc[key] || 0) + item.sum
          }
          return acc
        }, {})

        const formatted: DateValue[] = Object.entries(grouped).map(
          ([date, value]) => ({
            date: new Date(date),
            value,
          }),
        )

        setData(formatted)

        const to = selectedDates?.to ?? new Date()
        const from = selectedDates?.from ?? new Date()
        const previousFrom = subDays(from, 30)

        const currentInterval = interval(from, to)
        const previousInterval = interval(previousFrom, from)

        const current = formatted
          .filter((item) => isWithinInterval(item.date, currentInterval))
          .reduce((acc, item) => acc + item.value, 0)

        const previous = formatted
          .filter((item) => isWithinInterval(item.date, previousInterval))
          .reduce((acc, item) => acc + item.value, 0)

        setCurrentTotal(current)
        setPreviousTotal(previous)
      } catch (error) {
        console.error("Failed to fetch withdrawals:", error)
      }
    }

    fetchWithdrawals()
  }, [selectedDates])

  return {
    withdrawals: data,
    currentTotal,
    previousTotal,
  }
}
