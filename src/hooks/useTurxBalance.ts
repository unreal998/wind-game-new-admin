import { eachDayOfInterval, endOfDay, format, startOfDay } from "date-fns"
import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { createClient } from "@/utils/supabase/client"
import { getPeriod } from "@/app/(cp)/overview/_components/FilterBar"
import { PeriodValue } from "@/types/overview"
import { formatInTimeZone } from "date-fns-tz"

export function useTurxBalance(selectedDates?: DateRange, prevDates?: PeriodValue) {
  const [turxBalance, setTurxBalance] = useState<{ date: Date; value: number }[]>([])
  const [currentTotalTurxBalance, setCurrentTotalTurxBalance] =
    useState<number>(0)
  const [previousTotalTurxBalance, setPreviousTotalTurxBalance] =
    useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
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
          .from("turx_dynamic")
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
              .from("turx_dynamic")
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

      const dailyStats = allData.reduce<Record<string, number>>((acc, turxDynamic) => {
        const localDay = formatInTimeZone(new Date(turxDynamic.created_at), "UTC", "yyyy-MM-dd");
        acc[localDay] = (acc[localDay] || 0) + turxDynamic.sum;
        return acc;
      }, {});

      const allDays = eachDayOfInterval({ start: fromDate, end: toDate });
      const allDaysPrevious = eachDayOfInterval({ start: previousDates?.from as Date, end: previousDates?.to as Date });

      const currentDaysTurxBalance = allDays.map((day) => {
        const localDay = format(day, "yyyy-MM-dd");
        return {
          date: day,
          value: dailyStats[localDay] || 0,
        };
      });

      const previousDaysTurxBalance = allDaysPrevious.map((day) => {
        const localDay = format(day, "yyyy-MM-dd");
        return {
          date: day,
          value: dailyStats[localDay] || 0,
        };
      });

      const turxBalance = [...currentDaysTurxBalance, ...previousDaysTurxBalance];

      setTurxBalance(turxBalance);
      setCurrentTotalTurxBalance(currentDaysTurxBalance[currentDaysTurxBalance.length - 1].value);
      setPreviousTotalTurxBalance(previousDaysTurxBalance[previousDaysTurxBalance.length - 1].value);
    }

    fetchData()
  }, [selectedDates])

  return {
    turxBalance,
    currentTotalTurxBalance,
    previousTotalTurxBalance,
  }
}
