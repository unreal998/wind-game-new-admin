import { useEffect, useState } from "react"
import { startOfDay, interval, isWithinInterval, subDays } from "date-fns"
import axios from "axios"

type Transaction = {
  created_at: string
}

type DateValue = { date: Date; value: number }

export function useTransactionStatsNew() {
  const [transactionData, setTransactionData] = useState<DateValue[]>([])
  const [currentTotalTransactions, setCurrentTotalTransactions] =
    useState<number>(0)
  const [previousTotalTransactions, setPreviousTotalTransactions] =
    useState<number>(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://aedf-95-164-85-150.ngrok-free.app/transaction/all",
          {
            headers: {
              "ngrok-skip-browser-warning": true,
            },
          },
        )

        const rawData: Transaction[] = response.data.data

        const grouped = rawData.reduce<Record<string, number>>((acc, item) => {
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

        setTransactionData(formatted)

        const today = new Date()
        const from = subDays(today, 30)
        const previousFrom = subDays(from, 30)

        const currentInterval = interval(from, today)
        const previousInterval = interval(previousFrom, from)

        const current = formatted
          .filter((item) => isWithinInterval(item.date, currentInterval))
          .reduce((acc, item) => acc + item.value, 0)

        const previous = formatted
          .filter((item) => isWithinInterval(item.date, previousInterval))
          .reduce((acc, item) => acc + item.value, 0)

        setCurrentTotalTransactions(current)
        setPreviousTotalTransactions(previous)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      }
    }

    fetchTransactions()
  }, [])

  return {
    transactions: transactionData,
    currentTotalTransactions,
    previousTotalTransactions,
  }
}
