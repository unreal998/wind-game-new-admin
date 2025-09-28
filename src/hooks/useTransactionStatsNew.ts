import { useEffect, useState } from "react"
import { startOfDay, interval, isWithinInterval, subDays } from "date-fns"
import axios from "axios"
import { DateRange } from "react-day-picker"

type Transaction = {
  created_at: string
  summ: number
  txid: string
}

type DateValue = { date: Date; value: number }

export function useTransactionStatsNew(
  selectedPeriod: DateRange | undefined,
  selectedDates: string,
) {
  const [transactionData, setTransactionData] = useState<DateValue[]>([])
  const [currentTotalTransactions, setCurrentTotalTransactions] =
    useState<number>(0)
  const [previousTotalTransactions, setPreviousTotalTransactions] =
    useState<number>(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://turbinex.pp.ua/transaction/all",
          {
            headers: {
              "ngrok-skip-browser-warning": true,
            },
          },
        )

        const rawData: Transaction[] = response.data.data

        const filteredRawData = rawData.filter((item) => {
          return item.txid !== "1w23uui8890bbh1y7u9it5r2cv2g" && item.txid !== "312r2r12f12r12f12fqwfh55h5h"
        })
        const grouped = filteredRawData.reduce<Record<string, number>>((acc, item) => {
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
