import { eachDayOfInterval, isWithinInterval, startOfDay } from "date-fns"
import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { DateValue } from "./useWithdrawalsStats"
import { createClient } from "@/utils/supabase/client"

type TurxBalance = {
  id: string
  created_at: string
  sum: number
}

export function useTurxBalance(selectedDates: DateRange | undefined) {
  const [turxBalance, setTurxBalance] = useState<DateValue[]>([])
  const [currentTotalTurxBalance, setCurrentTotalTurxBalance] =
    useState<number>(0)
  const [previousTotalTurxBalance, setPreviousTotalTurxBalance] =
    useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("turx_dynamic").select("*")
      if (error) {
        console.error(`ERROR FETCHING TURX BALANCE: ${error}`)
        return
      }

      const turxBalances = data as TurxBalance[]
      console.log("turxBalances:", turxBalances)

      let from: Date, to: Date
      if (selectedDates?.from && selectedDates?.to) {
        from = startOfDay(selectedDates.from)
        to = startOfDay(selectedDates.to)
      } else {
        const allDates = [
          ...turxBalances.map((tb) => startOfDay(new Date(tb.created_at))),
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

      const filteredTb = turxBalances.filter((tb) =>
        isInRange(startOfDay(new Date(tb.created_at))),
      )

      // Group by day
      const tbByDay: Record<string, number> = {}
      filteredTb.forEach((tb) => {
        const key = startOfDay(new Date(tb.created_at)).toISOString()
        tbByDay[key] = (tbByDay[key] || 0) + Number(tb.sum)
      })

      const days = eachDayOfInterval({ start: from, end: to })
      let runningBalance = 0
      const result: DateValue[] = days.map((date) => {
        const key = startOfDay(date).toISOString()
        runningBalance += tbByDay[key] || 0
        return { date, value: runningBalance }
      })

      setTurxBalance(result)

      const intervalLength = days.length > 0 ? days.length : 1
      const prevTo = from
      const prevFrom = new Date(
        from.getTime() - intervalLength * 24 * 60 * 60 * 1000,
      )
      const prevDays = eachDayOfInterval({
        start: prevFrom,
        end: new Date(prevTo.getTime() - 24 * 60 * 60 * 1000),
      })

      const currentTotal =
        result.length > 0 ? result[result.length - 1].value : 0

      let prevRunningBalance = 0
      const prevResult: DateValue[] = prevDays.map((date) => {
        const key = startOfDay(date).toISOString()
        prevRunningBalance += tbByDay[key] || 0
        return { date, value: prevRunningBalance }
      })
      const previousTotal =
        prevResult.length > 0 ? prevResult[prevResult.length - 1].value : 0

      setCurrentTotalTurxBalance(currentTotal)
      setPreviousTotalTurxBalance(previousTotal)
    }

    fetchData()
  }, [selectedDates])

  return {
    turxBalance,
    currentTotalTurxBalance,
    previousTotalTurxBalance,
  }
}
