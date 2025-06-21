"use client"

import { Badge } from "@/components/Badge"
import { useRegistrationStats } from "@/hooks/useRegistrationStats"

import { cx, formatters } from "@/lib/utils"
import { type PeriodValue } from "@/types/overview"
import {
  eachDayOfInterval,
  formatDate,
  interval,
  isWithinInterval,
  startOfDay,
} from "date-fns"
import { type DateRange } from "react-day-picker"
import { getPeriod } from "./FilterBar"
import { LineChart } from "./LineChart"
import { useWithdrawalsStats } from "@/hooks/useWithdrawalsStats"
import { useTransactionStatsNew } from "@/hooks/useTransactionStatsNew"

type StatsType = {
  registrations: Array<{ date: Date; value: number }>
  deposits: Array<{ date: Date; value: number }>
  withdrawals: Array<{ date: Date; value: number }>
}

export type CardProps = {
  title: keyof StatsType
  label: string
  type: "currency" | "unit"
  selectedDates: DateRange | undefined
  selectedPeriod: PeriodValue
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
}: CardProps) {
  const formatter = formattingMap[type]

  // Отримуємо дані транзакцій та реєстрацій
  const registrationStats = useRegistrationStats()
  const { withdrawals, currentTotal, previousTotal } = useWithdrawalsStats()
  const { transactions, currentTotalTransactions, previousTotalTransactions } =
    useTransactionStatsNew(selectedDates, selectedPeriod)

  // Вибираємо потрібний набір даних
  const stats: StatsType = {
    registrations: registrationStats.registrations,
    deposits: transactions,
    withdrawals: withdrawals,
  }

  // Створюємо інтервали для фільтрації
  const selectedDatesInterval =
    selectedDates?.from && selectedDates?.to
      ? interval(selectedDates.from, selectedDates.to)
      : null

  const prevDates = getPeriod(selectedDates, selectedPeriod)
  const prevDatesInterval =
    prevDates?.from && prevDates?.to
      ? interval(prevDates.from, prevDates.to)
      : null

  // Фільтруємо дані за інтервалами
  const data = (stats[title] || [])
    .filter((item) => {
      if (selectedDatesInterval) {
        return isWithinInterval(item.date, selectedDatesInterval)
      }
      return false
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  // Фільтруємо дані для періоду порівняння
  const prevData =
    selectedPeriod !== "no-comparison"
      ? (stats[title] || [])
          .filter((item) => {
            if (prevDatesInterval) {
              return isWithinInterval(item.date, prevDatesInterval)
            }
            return false
          })
          .sort((a, b) => a.date.getTime() - b.date.getTime())
      : []

  // Створюємо масиви дат для обох періодів
  const allDatesInInterval =
    selectedDates?.from && selectedDates?.to
      ? eachDayOfInterval(interval(selectedDates.from, selectedDates.to))
      : []

  const allPrevDatesInInterval =
    prevDates?.from && prevDates?.to
      ? eachDayOfInterval(interval(prevDates.from, prevDates.to))
      : []

  // Формуємо дані для графіка
  const chartData = allDatesInInterval.map((date, index) => {
    // Знаходимо дані для поточної дати
    const overview = data.find(
      (d) => startOfDay(d.date).getTime() === startOfDay(date).getTime(),
    )

    // Беремо відповідну дату з періоду порівняння
    const compareDate = allPrevDatesInInterval[index]

    // Шукаємо дані для дати порівняння
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
        : chartData.reduce((acc, item) => acc + (item.value || 0), 0)

  const previousValue =
    title === "withdrawals"
      ? previousTotal
      : title === "deposits"
        ? previousTotalTransactions
        : chartData.reduce((acc, item) => acc + (item.previousValue || 0), 0)

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
          {formatter(value)}
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
