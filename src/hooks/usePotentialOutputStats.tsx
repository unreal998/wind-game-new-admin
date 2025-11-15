import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { createClient } from "@/utils/supabase/client"
import { eachDayOfInterval, endOfDay, format, startOfDay } from "date-fns"
import { getPeriod } from "@/app/(cp)/overview/_components/FilterBar"
import { formatInTimeZone } from "date-fns-tz"
import { PeriodValue } from "@/types/overview"
import axios from "axios"

export const usePotentialOutputStats = (selectedDates?: DateRange, setPotentialTonOutput?: (value: number) => void, prevDates?: PeriodValue) => {
    const [potentialOutput, setPotentialOutput] = useState<Array<{ date: Date; value: number }>>([])
    const [currentTotalPotentialOutput, setCurrentTotalPotentialOutput] = useState<number>(0)
    const [previousTotalPotentialOutput, setPreviousTotalPotentialOutput] = useState<number>(0)

    useEffect(() => {
        const fetchPotentialOutput = async () => {
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
          .from("potential_output_dynamic")
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
              .from("potential_output_dynamic")
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

      const dailyStats = allData.reduce<Record<string, number>>((acc, potentialOutput) => {
        const localDay = formatInTimeZone(new Date(potentialOutput.created_at), "UTC", "yyyy-MM-dd");
        acc[localDay] = (acc[localDay] || 0) + potentialOutput.sum;
        return acc;
      }, {});

      const allDays = eachDayOfInterval({ start: fromDate, end: toDate });
      const allDaysPrevious = eachDayOfInterval({ start: previousDates?.from as Date, end: previousDates?.to as Date });

      const currentDaysPotentialOutput = allDays.map((day) => {
        const localDay = format(day, "yyyy-MM-dd");
        return {
          date: day,
          value: dailyStats[localDay] || 0,
        };
      });

      const previousDaysPotentialOutput = allDaysPrevious.map((day) => {
        const localDay = format(day, "yyyy-MM-dd");
        return {
          date: day,
          value: dailyStats[localDay] || 0,
        };
      });

      const potentialOutput = [...currentDaysPotentialOutput, ...previousDaysPotentialOutput];

      const currentPotentialOutput = await axios.get(`https://turbinex.pp.ua/user/potential-ton-output`);
      setPotentialTonOutput?.(currentPotentialOutput.data.potentialTONOutput);
      setPotentialOutput(potentialOutput);
      setCurrentTotalPotentialOutput(currentDaysPotentialOutput[currentDaysPotentialOutput.length - 1].value);
      setPreviousTotalPotentialOutput(previousDaysPotentialOutput[previousDaysPotentialOutput.length - 1].value);
    }
    fetchPotentialOutput()
    }, [selectedDates])
    return { potentialOutput, currentTotalPotentialOutput, previousTotalPotentialOutput }
}