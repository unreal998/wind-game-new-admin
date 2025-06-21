import { useEffect, useState } from "react"
import { startOfDay, interval, isWithinInterval, subDays } from "date-fns"
import axios from "axios"
import { DateRange } from "react-day-picker"

type Transaction = {
  created_at: string
  summ: number
}

type DateValue = { date: Date; value: number }

export function useTransactionStatsNew(selectedPeriod: DateRange | undefined, selectedDates: string) {
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
          acc[key] = (acc[key] || 0) + item.summ
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
        console.log("Selected Dates:", selectedDates, selectedPeriod)
        let currentInterval = interval(from, today)
        let previousInterval = interval(previousFrom, from)
        if (selectedPeriod && selectedPeriod.from && selectedPeriod.to) {
          currentInterval = interval(selectedPeriod.from, selectedPeriod.to)
          const previousFrom = subDays(selectedPeriod.from, 30)
          previousInterval = interval(previousFrom, selectedPeriod.from)
        }


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
  }, [selectedPeriod, selectedDates])

  return {
    transactions: transactionData,
    currentTotalTransactions,
    previousTotalTransactions,
  }
}
