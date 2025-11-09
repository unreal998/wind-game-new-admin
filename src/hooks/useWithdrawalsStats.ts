import { useEffect, useState } from "react"
import { startOfDay, endOfDay, format, eachDayOfInterval } from "date-fns"
import { DateRange } from "react-day-picker"
import { getPeriod } from "@/app/(cp)/overview/_components/FilterBar"
import { createClient } from "@/utils/supabase/client"
import { PeriodValue } from "@/types/overview"
import { formatInTimeZone } from "date-fns-tz"

export function useWithdrawalsStats(selectedDates?: DateRange, prevDates?: PeriodValue) {
  const [data, setData] = useState<{ withdrawals: { date: Date; value: number }[] }>({ withdrawals: [] })
  const [currentTotal, setCurrentTotal] = useState<number>(0)
  const [previousTotal, setPreviousTotal] = useState<number>(0)

  useEffect(() => {
    const fetchWithdrawals = async () => {
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
          .from("withdraw")
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
              .from("withdraw")
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

      const dailyStats = allData.reduce<Record<string, number>>((acc, withdrawal) => {
        const localDay = formatInTimeZone(new Date(withdrawal.created_at), "UTC", "yyyy-MM-dd");
        acc[localDay] = (acc[localDay] || 0) + withdrawal.sum;
        return acc;
      }, {});

      const allDays = eachDayOfInterval({ start: fromDate, end: toDate });
      const allDaysPrevious = eachDayOfInterval({ start: previousDates?.from as Date, end: previousDates?.to as Date });

      const currentDaysWithdrawals = allDays.map((day) => {
        const localDay = format(day, "yyyy-MM-dd");
        return {
          date: day,
          value: dailyStats[localDay] || 0,
        };
      });

      const previousDaysWithdrawals = allDaysPrevious.map((day) => {
        const localDay = format(day, "yyyy-MM-dd");
        return {
          date: day,
          value: dailyStats[localDay] || 0,
        };
      });

      const withdrawals = [...currentDaysWithdrawals, ...previousDaysWithdrawals];

      setData({ withdrawals: withdrawals });
      setCurrentTotal(currentDaysWithdrawals.reduce((acc, withdrawal) => acc + withdrawal.value, 0));
      setPreviousTotal(previousDaysWithdrawals.reduce((acc, withdrawal) => acc + withdrawal.value, 0));
    }

    fetchWithdrawals()
  }, [selectedDates])

  return {
    withdrawals: data.withdrawals,
    currentTotal,
    previousTotal,
  }
}
