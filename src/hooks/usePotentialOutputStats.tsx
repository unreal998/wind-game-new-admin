import axios from "axios"
import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { DateValue } from "./useWithdrawalsStats"
import { createClient } from "@/utils/supabase/client"
import { eachDayOfInterval, isWithinInterval, startOfDay } from "date-fns"


type PotentialOutput = {
  id: string
  created_at: string
  sum: number
}

export const usePotentialOutputStats = (
    selectedDates: DateRange | undefined
) => {
    const [potentialOutput, setPotentialOutput] = useState<DateValue[]>([])
    const [currentTotalPotentialOutput, setCurrentTotalPotentialOutput] = useState<number>(0)
    const [previousTotalPotentialOutput, setPreviousTotalPotentialOutput] = useState<number>(0)

    useEffect(() => {
        const fetchPotentialOutput = async () => {
            const supabase = createClient()
            const { data, error } = await supabase.from("potential_output_dynamic").select("*")
            if (error) {
                console.error("Error fetching potential output:", error)
                return
            }
            const potentialOutput = data as PotentialOutput[]
            let from: Date, to: Date
            if (selectedDates?.from && selectedDates?.to) {
                from = startOfDay(selectedDates.from)
                to = startOfDay(selectedDates.to)
            } else {
                const allDates = [
                    ...potentialOutput.map((po) => startOfDay(new Date(po.created_at))),
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
            const filteredPotentialOutput = potentialOutput.filter((po) =>
                isInRange(startOfDay(new Date(po.created_at))),
            )
            const potentialOutputByDay: Record<string, number> = {}
            filteredPotentialOutput.forEach((po) => {
                const key = startOfDay(new Date(po.created_at)).toISOString()
                potentialOutputByDay[key] = (potentialOutputByDay[key] || 0) + Number(po.sum)
            })
            const formatted: DateValue[] = Object.entries(potentialOutputByDay).map(
                ([date, value]) => ({
                    date: new Date(date),
                    value,
                }),
            )
            setPotentialOutput(formatted)

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
            const currentTotal =
                formatted.length > 0 ? formatted[formatted.length - 1].value : 0
            let prevRunningBalance = 0
            const prevResult: DateValue[] = prevDays.map((date) => {
                const key = startOfDay(date).toISOString()
                prevRunningBalance = potentialOutputByDay[key] || 0
                return { date, value: prevRunningBalance }
            })
            const previousTotal =
                prevResult.length > 0 ? prevResult[prevResult.length - 1].value : 0
            setCurrentTotalPotentialOutput(currentTotal)
            setPreviousTotalPotentialOutput(previousTotal)
        }
        fetchPotentialOutput()
    }, [selectedDates])
    return { potentialOutput, currentTotalPotentialOutput, previousTotalPotentialOutput }
}