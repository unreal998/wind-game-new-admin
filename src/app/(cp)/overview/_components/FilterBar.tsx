"use client"

import {
  Select,
  SelectContent,
  SelectItemPeriod,
  SelectTrigger,
  SelectValue,
} from "./Select"

import { Label } from "@/components/Label"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"

import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Checkbox"
import { TRANSLATIONS_DATEPICKER } from "@/components/data-table/constants"
import { DateRangePicker } from "@/components/DatePicker"
import { cx } from "@/lib/utils"
import { type PeriodValue, categories } from "@/types/overview"
import { RiSettings5Line } from "@remixicon/react"
import {
  eachDayOfInterval,
  interval,
  subDays,
  subMonths,
  subYears,
} from "date-fns"
import { uk } from "date-fns/locale"
import React from "react"
import { type DateRange } from "react-day-picker"
import { ChartCard } from "./ChartCard"

export type Period = {
  value: PeriodValue
  label: string
}

export const periods: Period[] = [
  {
    value: "previous-period",
    label: "Попередній період",
  },
  {
    value: "previous-month",
    label: "Попередній місяць",
  },
  {
    value: "last-year",
    label: "Попередній рік",
  },
  {
    value: "no-comparison",
    label: "Без порівняння",
  },
]

export const getPeriod = (
  dateRange: DateRange | undefined,
  value: PeriodValue,
): DateRange | undefined => {
  if (!dateRange) return undefined
  const from = dateRange.from
  const to = dateRange.to
  switch (value) {
    case "previous-period":
      let previousPeriodFrom
      let previousPeriodTo
      if (from && to) {
        const datesInterval = interval(from, to)
        const numberOfDaysBetween = eachDayOfInterval(datesInterval).length
        previousPeriodFrom = subDays(from, numberOfDaysBetween)
        previousPeriodTo = subDays(to, numberOfDaysBetween)
      }
      return {
        from: previousPeriodFrom,
        to: previousPeriodTo,
      }
    case "previous-month":
      return {
        from: from ? subMonths(from, 1) : undefined,
        to: to ? subMonths(to, 1) : undefined,
      }
    case "last-year":
      return {
        from: from ? subYears(from, 1) : undefined,
        to: to ? subYears(to, 1) : undefined,
      }
    default:
      return undefined
  }
}

interface FilterBarProps {
  maxDate?: Date
  minDate?: Date
  selectedDates: DateRange | undefined
  onDatesChange: (dates: DateRange | undefined) => void
  selectedPeriod: PeriodValue
  onPeriodChange: (period: PeriodValue) => void
  categories: typeof categories
  selectedCategories: (typeof categories)[number]["title"][]
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<(typeof categories)[number]["title"][]>
  >
}

export function FilterBar({
  maxDate,
  minDate,
  selectedDates,
  onDatesChange,
  selectedPeriod,
  onPeriodChange,
  categories,
  selectedCategories,
  setSelectedCategories,
}: FilterBarProps) {
  const [tempSelectedCategories, setTempSelectedCategories] =
    React.useState(selectedCategories)

  const handleCategoryChange = (
    category: (typeof categories)[number]["title"],
  ) => {
    setTempSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    )
  }

  const handleApply = () => {
    setSelectedCategories(tempSelectedCategories)
  }

  return (
    <div className="flex w-full justify-between">
      <div className="w-full sm:flex sm:items-center sm:gap-2">
        <DateRangePicker
          value={selectedDates}
          onChange={onDatesChange}
          className="w-full sm:w-fit"
          toDate={maxDate}
          fromDate={minDate}
          locale={uk}
          align="start"
          translations={TRANSLATIONS_DATEPICKER}
        />
        <span className="hidden text-sm font-medium text-gray-500 sm:block">
          порівнювати з
        </span>
        <Select
          defaultValue="no-comparison"
          value={selectedPeriod}
          onValueChange={(value) => {
            onPeriodChange(value as PeriodValue)
          }}
        >
          <SelectTrigger className="mt-2 w-full px-2 sm:mt-0 sm:w-fit sm:py-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItemPeriod
                key={period.value}
                value={period.value}
                period={getPeriod(selectedDates, period.value)}
              >
                {period.label}
              </SelectItemPeriod>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="hidden px-2.5 py-1 sm:flex">
            <RiSettings5Line className="size-4 shrink-0" aria-hidden="true" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Налаштуйте графіки</DialogTitle>
            <DialogDescription className="sr-only">
              Додати або видалити графіки для панелі огляду.
            </DialogDescription>
          </DialogHeader>
          <div
            className={cx(
              "mt-8 grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-scroll sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
            )}
          >
            {categories.map((category) => (
              <Label
                htmlFor={category.title}
                key={category.title}
                className="relative cursor-pointer rounded-md border border-gray-200 p-4 shadow-sm dark:border-gray-800"
              >
                <Checkbox
                  id={category.title}
                  className="absolute right-4"
                  checked={tempSelectedCategories.includes(category.title)}
                  onCheckedChange={() => handleCategoryChange(category.title)}
                />
                <div className="pointer-events-none">
                  <ChartCard
                    title={category.title}
                    label={category.label}
                    type={category.type}
                    selectedDates={selectedDates}
                    selectedPeriod={selectedPeriod}
                  />
                </div>
              </Label>
            ))}
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                className="mt-2 w-full sm:mt-0 sm:w-fit"
                variant="secondary"
              >
                Скасувати
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="w-full sm:w-fit" onClick={handleApply}>
                Застосувати
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
