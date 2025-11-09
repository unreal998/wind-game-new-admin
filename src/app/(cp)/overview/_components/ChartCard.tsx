"use client"

import { Badge } from "@/components/Badge"
import { cx, formatters } from "@/lib/utils"
import { type PeriodValue } from "@/types/overview"
import {
  eachDayOfInterval,
  formatDate,
  interval,
  startOfDay,
} from "date-fns"
import { type DateRange } from "react-day-picker"
import { getPeriod } from "./FilterBar"
import { LineChart } from "./LineChart"
import { useWithdrawalsStats } from "@/hooks/useWithdrawalsStats"
import { useTransactionStatsNew } from "@/hooks/useTransactionStatsNew"
import { useTurxBalance } from "@/hooks/useTurxBalance"
import { useRegistrationStats } from "@/hooks/useRegistrationStats"
import { useReferalsStats } from "@/hooks/useReferalsStats"
import { usePotentialOutputStats } from "@/hooks/usePotentialOutputStats"
import { useEffect, useState } from "react"

type StatsType = {
  registrations: Array<{ date: Date; value: number }>
  deposits: Array<{ date: Date; value: number }>
  withdrawals: Array<{ date: Date; value: number }>
  referals: Array<{ date: Date; value: number }>
  turxBalance: Array<{ date: Date; value: number }>
  tonBalance: Array<{ date: Date; value: number }>
  potentialOutput: Array<{ date: Date; value: number }>
  referalsKWT: Array<{ date: Date; value: number }>
  referalsTon: Array<{ date: Date; value: number }>
}

export type CardProps = {
  title: keyof StatsType
  label: string
  type: "currency" | "unit"
  selectedDates: DateRange | undefined
  selectedPeriod: PeriodValue
  setPotentialTonOutput?: (value: number) => void
}

const formattingMap = {
  currency: formatters.currency,
  unit: formatters.unit,
}

export const getBadgeType = (value: number) => {
  if (value > 0) {
    return "success"
  } else if (value < 0) {
    if (value < -50) {
      return "warning"
    }
    return "error"
  } else {
    return "neutral"
  }
}

export function ChartCard({
  title,
  label,
  type,
  selectedDates,
  selectedPeriod,
  setPotentialTonOutput,
}: CardProps) {
  const formatter = formattingMap[type]

  const { registrations } = useRegistrationStats(selectedDates, selectedPeriod)
  const { withdrawals, currentTotal, previousTotal } =
    useWithdrawalsStats(selectedDates, selectedPeriod)
  const { transactions, currentTotalTransactions, previousTotalTransactions } =
    useTransactionStatsNew(selectedDates, selectedPeriod)
  const { 
    referalsTonBalance, 
    referalsKWTBalance, 
    currentTotalReferalsTonBalance, 
    currentTotalReferalsKWTBalance, 
    previousTotalReferalsTonBalance, 
    previousTotalReferalsKWTBalance 
  } = useReferalsStats(selectedDates, selectedPeriod)
  const [tonBalance, setTonBalance] = useState<Array<{ date: Date; value: number }>>([])
  const [currentTotalTonBalance, setCurrentTotalTonBalance] = useState<number>(0)
  const [previousTotalTonBalance, setPreviousTotalTonBalance] = useState<number>(0)
  const { turxBalance, currentTotalTurxBalance, previousTotalTurxBalance } =
    useTurxBalance(selectedDates, selectedPeriod)
    
  const { potentialOutput, currentTotalPotentialOutput, previousTotalPotentialOutput } =
    usePotentialOutputStats(selectedDates, selectedPeriod)

  useEffect(() => {
    if (transactions?.length && withdrawals?.length) {
      const balanceData: Array<{ date: Date; value: number }> = [];
      let balance = 0;
      let previousBalance = 0;
      const startSelectedDate = startOfDay(selectedDates?.from || new Date());
      
      transactions.forEach((t, index) => {
        if (t.date >= startSelectedDate) {
          balance += t.value - (withdrawals[index]?.value || 0);
          balanceData.push({
            date: t.date,
            value: balance,
          });
        } else {
          previousBalance += t.value - (withdrawals[index]?.value || 0);
          balanceData.push({
            date: t.date,
            value: previousBalance,
          });
        }
        setPotentialTonOutput?.(tonBalance[tonBalance.length - 1]?.value || 0)
      });
      setTonBalance(balanceData)
      setCurrentTotalTonBalance(balance);
      setPreviousTotalTonBalance(previousBalance);
    }
  }, [withdrawals, transactions, selectedDates, selectedPeriod])

  const stats: StatsType = {
    registrations: registrations,
    deposits: transactions,
    withdrawals: withdrawals,
    referals: referalsTonBalance,
    tonBalance: tonBalance,
    turxBalance: turxBalance,
    potentialOutput: potentialOutput,
    referalsKWT: referalsKWTBalance,
    referalsTon: referalsTonBalance,
  }

  const prevDates = getPeriod(selectedDates, selectedPeriod)

  const data = (stats[title] || []).sort((a, b) => a.date.getTime() - b.date.getTime())

  const prevData =
    selectedPeriod !== "no-comparison"
      ? (stats[title] || [])
        .sort((a, b) => a.date.getTime() - b.date.getTime())
      : []

  const allDatesInInterval =
    selectedDates?.from && selectedDates?.to
      ? eachDayOfInterval(interval(selectedDates.from, selectedDates.to))
      : []

  const allPrevDatesInInterval =
    prevDates?.from && prevDates?.to
      ? eachDayOfInterval(interval(prevDates.from, prevDates.to))
      : []

  const chartData = allDatesInInterval.map((date, index) => {
    const overview = data.find(
      (d) => startOfDay(d.date).getTime() === startOfDay(date).getTime(),
    )

    const compareDate = allPrevDatesInInterval[index]

    const prevOverview =
      selectedPeriod !== "no-comparison" && compareDate
        ? prevData.find(
          (d) =>
            startOfDay(d.date).getTime() ===
            startOfDay(compareDate).getTime(),
        )
        : null

    return {
      title: label,
      date,
      formattedDate: formatDate(date, "dd.MM.yyyy"),
      value: overview?.value ?? 0,
      previousDate: compareDate ?? null,
      previousFormattedDate: compareDate
        ? formatDate(compareDate, "dd.MM.yyyy")
        : null,
      previousValue:
        selectedPeriod !== "no-comparison" ? (prevOverview?.value ?? 0) : null,
      evolution:
        selectedPeriod !== "no-comparison" &&
          overview?.value &&
          prevOverview?.value
          ? (overview.value - prevOverview.value) / prevOverview.value
          : undefined,
    }
  })

  const categories =
    selectedPeriod === "no-comparison" ? ["value"] : ["value", "previousValue"]

  const value =
    title === "withdrawals"
      ? currentTotal
      : title === "deposits"
        ? currentTotalTransactions
        : title === "tonBalance"
          ? currentTotalTonBalance
          : title === "turxBalance"
            ? currentTotalTurxBalance
            : title === "potentialOutput"
              ? currentTotalPotentialOutput
            : title === "referalsKWT"
              ? currentTotalReferalsKWTBalance
            : title === "referalsTon"
              ? currentTotalReferalsTonBalance
            : chartData.reduce((acc, item) => acc + (item.value || 0), 0)

  const previousValue =
    title === "withdrawals"
      ? previousTotal
      : title === "deposits"
        ? previousTotalTransactions
        : title === "tonBalance"
          ? previousTotalTonBalance
          : title === "turxBalance"
            ? previousTotalTurxBalance
            : title === "potentialOutput"
              ? previousTotalPotentialOutput
            : title === "referalsKWT"
              ? previousTotalReferalsKWTBalance
            : title === "referalsTon"
              ? previousTotalReferalsTonBalance
            : chartData.reduce(
              (acc, item) => acc + (item.previousValue || 0),
              0,
            )

  const evolution =
    selectedPeriod !== "no-comparison" && value !== 0 && previousValue !== 0
      ? (value - previousValue) / previousValue
      : null

  return (
    <div className={cx("transition")}>
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex h-6 items-center gap-x-2">
          <dt className="font-semibold text-gray-900 sm:text-sm dark:text-gray-50">
            {label}
          </dt>
          {evolution && (
            <Badge variant={getBadgeType(evolution)}>
              {formatters.percentage(evolution)}
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <dd className="text-xl text-indigo-600 dark:text-indigo-500">
          {(Math.round(formatter(value) * 100) / 100).toFixed(2)}
        </dd>
        {selectedPeriod !== "no-comparison" && (
          <dd className="text-sm text-gray-500">{formatter(previousValue)}</dd>
        )}
      </div>
      <LineChart
        className="mt-6 h-32"
        data={chartData || []}
        index="formattedDate"
        colors={["indigo", "gray"]}
        startEndOnly={true}
        valueFormatter={(value) => formatter(value as number)}
        showYAxis={false}
        showLegend={false}
        categories={categories}
        autoMinValue
      />
    </div>
  )
}
