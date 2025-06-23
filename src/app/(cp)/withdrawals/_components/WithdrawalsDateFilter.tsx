import { TRANSLATIONS_DATEPICKER } from "@/components/data-table/constants"
import { DateRangePicker } from "@/components/DatePicker"
import { RiSettings5Line } from "@remixicon/react"
import { uk } from "date-fns/locale"
import React, { Dispatch, SetStateAction } from "react"
import { type DateRange } from "react-day-picker"
import { subDays } from "date-fns"

export function WithdrawalsDateFilter({
  setSelectedDateRange,
}: {
  setSelectedDateRange?: Dispatch<SetStateAction<DateRange | undefined>>
}) {
  const [selectedDates, setSelectedDates] = React.useState<
    DateRange | undefined
  >({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const maxDate = new Date()
  const minDate = subDays(new Date(), 365)

  return (
    <div className="flex w-full justify-between">
      <div className="w-full sm:flex sm:items-center sm:gap-2">
        <DateRangePicker
          setSelectedDateRange={setSelectedDateRange}
          value={selectedDates}
          onChange={(dates) => setSelectedDates(dates)}
          className="w-full sm:w-fit"
          toDate={maxDate}
          fromDate={minDate}
          locale={uk}
          align="start"
          translations={TRANSLATIONS_DATEPICKER}
        />
      </div>
    </div>
  )
}
