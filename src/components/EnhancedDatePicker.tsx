import { TRANSLATIONS_DATEPICKER } from "@/components/data-table/constants"
import { DateRangePicker } from "@/components/DatePicker"
import { uk } from "date-fns/locale"
import React, { Dispatch, SetStateAction, useState } from "react"
import { type DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { Button } from "./Button"

export function EnhancedDatePicker({
  setSelectedDateRange,
}: {
  setSelectedDateRange?: Dispatch<SetStateAction<DateRange | undefined>>
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [tempDateInput, setTempDateInput] = useState<{
    from: string
    to: string
  }>({
    from: "",
    to: "",
  })
  const [selectedDates, setSelectedDates] = React.useState<
    DateRange | undefined
  >({
    from: new Date(new Date().setDate(1)),
    to: new Date(),
  })

  const maxDate = new Date()
  const minDate = subDays(new Date(), 365)

  const handleDatePickerInput = () => {
    console.log(!tempDateInput.from, !tempDateInput.to)
    if (!tempDateInput.from || !tempDateInput.to) {
      alert("Помилка: Не всі дата інпути заповненi")
      return
    }
    if (
      new Date(tempDateInput.from).getFullYear() > 2025 ||
      new Date(tempDateInput.to).getFullYear() > 2025
    ) {
      alert("Помилка: Не вибирайте рок більше теперішнього")
      return
    }

    if (new Date(tempDateInput.from) > new Date(tempDateInput.to)) {
      alert("Помилка: Дата ВІД є вища ніж ДО")
      return
    }
    const fromTime = new Date(tempDateInput.from);
    fromTime.setHours(0)
    fromTime.setMinutes(0)
    fromTime.setSeconds(0)

    const toTime = new Date(tempDateInput.to);
    toTime.setHours(23)
    toTime.setMinutes(59)
    toTime.setSeconds(59)
    setSelectedDates({
      from: fromTime,
      to: toTime,
    })
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="w-full sm:flex sm:items-center sm:gap-2">
        <DateRangePicker
          setSelectedDateRange={(dates: any) => {
            dates?.from?.setHours(0)
            dates?.from?.setMinutes(0)
            dates?.from?.setSeconds(0)

            dates?.to?.setHours(23)
            dates?.to?.setMinutes(59)
            dates?.to?.setSeconds(59)

            if (setSelectedDateRange) setSelectedDateRange(dates)
          }}
          value={selectedDates}
          onChange={(dates) => {
            dates?.from?.setHours(0)
            dates?.from?.setMinutes(0)
            dates?.from?.setSeconds(0)

            dates?.to?.setHours(23)
            dates?.to?.setMinutes(59)
            dates?.to?.setSeconds(59)
            setSelectedDates(dates)

            if (setSelectedDateRange && dates) {
              setSelectedDateRange(dates)
            }
          }}
          className="w-full sm:w-fit"
          toDate={maxDate}
          fromDate={minDate}
          locale={uk}
          align="start"
          translations={TRANSLATIONS_DATEPICKER}
        />
      </div>
      {!open && (
        <Button onClick={() => setOpen(true)}>Обрати дату текстом</Button>
      )}
      {open && (
        <div className="m-2 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 self-end">
            <span>Від:</span>
            <input
              type="date"
              className="rounded border border-gray-600 bg-black px-2 py-1 text-white"
              onChange={(e) =>
                setTempDateInput((prev) => ({ ...prev, from: e.target.value }))
              }
              value={tempDateInput.from}
            />
          </div>
          <div className="flex items-center gap-1 self-end">
            <span>До:</span>
            <input
              type="date"
              className="rounded border border-gray-600 bg-black px-2 py-1 text-white"
              onChange={(e) =>
                setTempDateInput((prev) => ({ ...prev, to: e.target.value }))
              }
              value={tempDateInput.to}
            />
          </div>
          <Button
            onClick={() => {
              handleDatePickerInput()
              setOpen(false)
            }}
            className="rounded px-4 py-2"
          >
            Обрати
          </Button>
        </div>
      )}
    </div>
  )
}
