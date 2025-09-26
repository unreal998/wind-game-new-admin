import { useEffect, useState } from "react"
import { eachDayOfInterval, isWithinInterval, startOfDay } from "date-fns"
import { createClient } from "@/utils/supabase/client"
import { DateRange } from "react-day-picker"

type DateValue = { date: Date; value: number }

type ReferalsIncome = {
  id: string
  created_at: string
  sumTON: number
  sumKWT: number
}

export function useReferalsStats(
  selectedDates: DateRange | undefined
) {
  const [referalsTonBalance, setReferalsTonBalance] = useState<DateValue[]>([])
  const [currentTotalReferalsTonBalance, setCurrentTotalReferalsTonBalance] = useState<number>(0)
  const [previousTotalReferalsTonBalance, setPreviousTotalReferalsTonBalance] = useState<number>(0)

  const [referalsKWTBalance, setReferalsKWTBalance] = useState<DateValue[]>([])
  const [currentTotalReferalsKWTBalance, setCurrentTotalReferalsKWTBalance] = useState<number>(0)
  const [previousTotalReferalsKWTBalance, setPreviousTotalReferalsKWTBalance] = useState<number>(0)


  useEffect(() => {
    const fetchReferalsIncome = async () => {
        const supabase = createClient()
        const { data, error } = await supabase.from("referal_income_dynamic").select("*")
        if (error) {
            console.error("Error fetching potential output:", error)
            return
        }
        const referalsIncome = data as ReferalsIncome[]
        let from: Date, to: Date
        if (selectedDates?.from && selectedDates?.to) {
            from = startOfDay(selectedDates.from)
            to = startOfDay(selectedDates.to)
        } else {
            const allDates = [
                ...referalsIncome.map((po) => startOfDay(new Date(po.created_at))),
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
        const filteredReferalsIncome = referalsIncome.filter((po) =>
            isInRange(startOfDay(new Date(po.created_at))),
        )
        const referalsTonIncomeByDay: Record<string, number> = {}
        const referalsKWTIncomeByDay: Record<string, number> = {}
        filteredReferalsIncome.forEach((po) => {
            const key = startOfDay(new Date(po.created_at)).toISOString()
            referalsTonIncomeByDay[key] = (referalsTonIncomeByDay[key] || 0) + Number(po.sumTON)
            referalsKWTIncomeByDay[key] = (referalsKWTIncomeByDay[key] || 0) + Number(po.sumKWT)
        })
        const formattedTon: DateValue[] = Object.entries(referalsTonIncomeByDay).map(
            ([date, value]) => ({
                date: new Date(date),
                value,
            }),
        )
        setReferalsTonBalance(formattedTon)
        const formattedKWT: DateValue[] = Object.entries(referalsKWTIncomeByDay).map(
            ([date, value]) => ({
                date: new Date(date),
                value,
            }),
        )
        setReferalsKWTBalance(formattedKWT)

        const days = eachDayOfInterval({ start: from, end: to })
        const intervalLength = days.length > 0 ? days.length : 1
        const prevTo = from
        const prevFrom = new Date(
            from.getTime() - intervalLength * 24 * 60 * 60 * 1000,
        )
        const prevDays = eachDayOfInterval({
            start: prevFrom,
            end: new Date(prevTo.getTime() - 24 * 60 * 60 * 1000),
        })
        const currentTotalTon =
            formattedTon.length > 0 ? formattedTon[formattedTon.length - 1].value : 0
        const currentTotalKWT =
            formattedKWT.length > 0 ? formattedKWT[formattedKWT.length - 1].value : 0
        let prevRunningTonBalance = 0
        let prevRunningKWTBalance = 0
        const prevResultTon: DateValue[] = prevDays.map((date) => {
            const key = startOfDay(date).toISOString()
            prevRunningTonBalance = referalsTonIncomeByDay[key] || 0
            return { date, value: prevRunningTonBalance }
        })
        const prevResultKWT: DateValue[] = prevDays.map((date) => {
            const key = startOfDay(date).toISOString()
            prevRunningKWTBalance = referalsKWTIncomeByDay[key] || 0
            return { date, value: prevRunningKWTBalance }
        })
        const previousTotalTon =
            prevResultTon.length > 0 ? prevResultTon[prevResultTon.length - 1].value : 0
        const previousTotalKWT =
            prevResultKWT.length > 0 ? prevResultKWT[prevResultKWT.length - 1].value : 0

        setCurrentTotalReferalsTonBalance(currentTotalTon)
        setCurrentTotalReferalsKWTBalance(currentTotalKWT)
        setPreviousTotalReferalsTonBalance(previousTotalTon)
        setPreviousTotalReferalsKWTBalance(previousTotalKWT)
    }
    fetchReferalsIncome()
}, [selectedDates])

  return { referalsTonBalance, referalsKWTBalance, currentTotalReferalsTonBalance, currentTotalReferalsKWTBalance, previousTotalReferalsTonBalance, previousTotalReferalsKWTBalance }
}