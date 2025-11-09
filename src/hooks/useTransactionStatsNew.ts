import { useEffect, useState } from "react"
import { eachDayOfInterval, endOfDay, format, startOfDay } from "date-fns"
import { DateRange } from "react-day-picker"
import { PeriodValue } from "@/types/overview"
import { createClient } from "@/utils/supabase/client"
import { getPeriod } from "@/app/(cp)/overview/_components/FilterBar"

type Transaction = {
  created_at: string
  summ: number
  txid: string
}

export function useTransactionStatsNew(
  selectedDates?: DateRange, prevDates?: PeriodValue
) {
  const [stats, setStats] = useState<{
    transactions: Array<{ date: Date; value: number }>;
  }>({
    transactions: [],
  });
  const [currentTotalTransactions, setCurrentTotalTransactions] = useState<number>(0);
  const [previousTotalTransactions, setPreviousTotalTransactions] = useState<number>(0);

  useEffect(() => {
    const fetchTransactions = async () => {
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
          .from("transactions")
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
              .from("transactions")
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

      const dailyStats = allData.reduce<Record<string, number>>((acc, user) => {
        const localDay = format(startOfDay(new Date(user.created_at)), "yyyy-MM-dd");
        acc[localDay] = (acc[localDay] || 0) + user.summ;
        return acc;
      }, {});
      console.log("dailyStats=====>", dailyStats);
      const allDays = eachDayOfInterval({ start: fromDate, end: toDate });
      const allDaysPrevious = eachDayOfInterval({ start: previousDates?.from as Date, end: previousDates?.to as Date });

      const currentDaysRegistrations = allDays.map((day) => {
        const localDay = format(day, "yyyy-MM-dd");
        return {
          date: day,
          value: dailyStats[localDay] || 0,
        };
      });

      const previousDaysRegistrations = allDaysPrevious.map((day) => {
        const localDay = format(day, "yyyy-MM-dd");
        return {
          date: day,
          value: dailyStats[localDay] || 0,
        };
      });

      const transactions = [...currentDaysRegistrations, ...previousDaysRegistrations];

      setStats({ transactions });
      setCurrentTotalTransactions(allData.reduce((acc, tx) => acc + tx.summ, 0));
      setPreviousTotalTransactions(allData.reduce((acc, tx) => acc + tx.summ, 0));
    }

    fetchTransactions()
  }, [selectedDates])

  return { transactions: stats.transactions, currentTotalTransactions, previousTotalTransactions };
}
