"use client"

import { cx } from "@/lib/utils"
import { categories, type PeriodValue } from "@/types/overview"
import { subDays } from "date-fns"
import React, { useEffect, useState } from "react"
import { type DateRange } from "react-day-picker"
import { ChartCard } from "./_components/ChartCard"
import { FilterBar } from "./_components/FilterBar"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import NotAllowed from "@/components/NotAllowed"
import axios from "axios"

export default function Overview() {
  const userRole = useUserStore(roleSelector)
  const [potentialTonOutput, setPotentialTonOutput] = useState<number>(0)
  const [selectedDates, setSelectedDates] = React.useState<
    DateRange | undefined
  >({
    from: subDays(new Date(), new Date().getDate() - 1),
    to: new Date(),
  })

  const [selectedPeriod, setSelectedPeriod] =
    React.useState<PeriodValue>("previous-period")

  const [selectedCategories, setSelectedCategories] = React.useState<
    (typeof categories)[number]["title"][]
  >(categories.map((category) => category.title))

  useEffect(() => {
      const fetchPotentialTonOutput = async () => {
        const potentialTonOutput = await axios.get(`https://generously-nonfluorescent-marivel.ngrok-free.dev/user/potential-ton-output`, {
          headers: {
            "ngrok-skip-browser-warning": true,
          },
        })
        setPotentialTonOutput(potentialTonOutput.data.potentialTONOutput)
      }
      fetchPotentialTonOutput()
  }, [])

  if (userRole === "marketing") return <NotAllowed />

  return (
    <>
      <section aria-labelledby="usage-overview">
        <h1 className="text-2xl font-semibold">Динаміка</h1>
        <div className="flex items-center justify-between pb-4 pt-4">
          <FilterBar
            maxDate={new Date()}
            minDate={subDays(new Date(), 365)}
            selectedDates={selectedDates}
            onDatesChange={(dates) => {
              dates?.to?.setHours(23)
              dates?.to?.setMinutes(59)
              dates?.to?.setSeconds(59)

              dates?.from?.setHours(0)
              dates?.from?.setMinutes(0)
              dates?.from?.setSeconds(0)
              
              return setSelectedDates(dates) 
            }}
            selectedPeriod={selectedPeriod}
            onPeriodChange={(period) => setSelectedPeriod(period)}
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <dl
          className={cx(
            "mt-10 grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {categories
            .filter((category) => selectedCategories.includes(category.title))
            .map((category) => (
              <ChartCard
                key={category.title}
                title={category.title}
                label={category.label}
                type={category.type}
                selectedDates={selectedDates}
                selectedPeriod={selectedPeriod}
              />
          ))}
          <div>Загальна прогнозована сума виплат на даний момент: {potentialTonOutput.toFixed(2)} TON </div>
        </dl>
      </section>
    </>
  )
}
