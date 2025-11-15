import { useEffect, useState } from "react"
import { eachDayOfInterval, endOfDay, format, startOfDay } from "date-fns"
import { createClient } from "@/utils/supabase/client"
import { DateRange } from "react-day-picker"
import { PeriodValue } from "@/types/overview"
import { getPeriod } from "@/app/(cp)/overview/_components/FilterBar"
import { formatInTimeZone } from "date-fns-tz"

export function useReferalsStats(
    selectedDates?: DateRange, prevDates?: PeriodValue
) {
  const [referalsTonBalance, setReferalsTonBalance] = useState<Array<{ date: Date; value: number }>>([])
  const [currentTotalReferalsTonBalance, setCurrentTotalReferalsTonBalance] = useState<number>(0)
  const [previousTotalReferalsTonBalance, setPreviousTotalReferalsTonBalance] = useState<number>(0)

  const [referalsKWTBalance, setReferalsKWTBalance] = useState<Array<{ date: Date; value: number }>>([])
  const [currentTotalReferalsKWTBalance, setCurrentTotalReferalsKWTBalance] = useState<number>(0)
  const [previousTotalReferalsKWTBalance, setPreviousTotalReferalsKWTBalance] = useState<number>(0)


  useEffect(() => {
    const fetchReferalsIncome = async () => {
        const supabase = createClient();
        let previousDates: DateRange | undefined = undefined;
        if (prevDates) {
          previousDates = getPeriod(selectedDates, prevDates)
        };
        if (!selectedDates?.from || !selectedDates?.to) return;
  
        const fromDate = startOfDay(selectedDates.from);
        const toDate = endOfDay(selectedDates.to);
  
        const fromStr = format(fromDate, "yyyy-MM-dd HH:mm:ss");
        const toStr = format(toDate, "yyyy-MM-dd HH:mm:ss");
  
        let allData: any[] = [];
        let fromIndex = 0;
        let toIndex = 999;
  
        while (true) {
          const { data, error } = await supabase
            .from("referal_income_dynamic")
            .select("*")
            .gte("created_at", fromStr)
            .lte("created_at", toStr)
            .order("created_at", { ascending: true })
            .range(fromIndex, toIndex);
  
          if (error) {
            console.error("Error fetching registration stats:", error);
            break;
          }
  
          allData = allData.concat(data);
          if (data.length < 1000) break;
  
          fromIndex += 1000;
          toIndex += 1000;
        }
  
        if (previousDates !== undefined) {
          const fromDate = startOfDay(previousDates.from as Date);
          const toDate = endOfDay(previousDates.to as Date);
          const fromStr = format(fromDate, "yyyy-MM-dd HH:mm:ss");
          const toStr = format(toDate, "yyyy-MM-dd HH:mm:ss");
  
          while (true) {
              const { data, error } = await supabase
                .from("referal_income_dynamic")
                .select("*")
                .gte("created_at", fromStr)
                .lte("created_at", toStr)
                .order("created_at", { ascending: true })
                .range(fromIndex, toIndex);
      
              if (error) {
                console.error("Error fetching registration stats:", error);
                break;
              }
      
              allData = allData.concat(data);
              if (data.length < 1000) break;
      
              fromIndex += 1000;
              toIndex += 1000;
          }
        }

        const dailyStatsTon = allData.reduce<Record<string, number>>((acc, transaction) => {
          const localDay = formatInTimeZone(new Date(transaction.created_at), "UTC", "yyyy-MM-dd");
          acc[localDay] = (acc[localDay] || 0) + transaction.sumTON;
          return acc;
        }, {});

        const dailyStatsKWT = allData.reduce<Record<string, number>>((acc, transaction) => {
          const localDay = formatInTimeZone(new Date(transaction.created_at), "UTC", "yyyy-MM-dd");
          acc[localDay] = (acc[localDay] || 0) + transaction.sumKWT;
          return acc;
        }, {});
  
        const allDays = eachDayOfInterval({ start: fromDate, end: toDate });
        const allDaysPrevious = eachDayOfInterval({ start: previousDates?.from as Date, end: previousDates?.to as Date });
  
        const currentDaysTonTransactions = allDays.map((day) => {
          const localDay = format(day, "yyyy-MM-dd");
          return {
            date: day,
            value: dailyStatsTon[localDay] || 0,
          };
        });
  
        const previousDaysTonTransactions = allDaysPrevious.map((day) => {
          const localDay = format(day, "yyyy-MM-dd");
          return {
            date: day,
            value: dailyStatsTon[localDay] || 0,
          };
        });

        const currentDaysKWTTransactions = allDays.map((day) => {
          const localDay = format(day, "yyyy-MM-dd");
          return {
            date: day,
            value: dailyStatsKWT[localDay] || 0,
          };
        });

        const previousDaysKWTTransactions = allDaysPrevious.map((day) => {
          const localDay = format(day, "yyyy-MM-dd");
          return {
            date: day,
            value: dailyStatsKWT[localDay] || 0,
          };
        });
         
        const referalsTonBalance = [...currentDaysTonTransactions, ...previousDaysTonTransactions];
        const referalsKWTBalance = [...currentDaysKWTTransactions, ...previousDaysKWTTransactions];

      setReferalsTonBalance(referalsTonBalance)
      setReferalsKWTBalance(referalsKWTBalance)
      setCurrentTotalReferalsTonBalance(currentDaysTonTransactions[currentDaysTonTransactions.length - 1].value)
      setCurrentTotalReferalsKWTBalance(currentDaysKWTTransactions[currentDaysKWTTransactions.length - 1].value)
      setPreviousTotalReferalsTonBalance(previousDaysTonTransactions[previousDaysTonTransactions.length - 1].value)
      setPreviousTotalReferalsKWTBalance(previousDaysKWTTransactions[previousDaysKWTTransactions.length - 1].value)
    }
    fetchReferalsIncome()
}, [selectedDates])

  return { referalsTonBalance, referalsKWTBalance, currentTotalReferalsTonBalance, currentTotalReferalsKWTBalance, previousTotalReferalsTonBalance, previousTotalReferalsKWTBalance }
}