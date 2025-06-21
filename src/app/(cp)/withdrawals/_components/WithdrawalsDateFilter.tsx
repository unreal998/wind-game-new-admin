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
import { TRANSLATIONS_DATEPICKER } from "@/components/data-table/constants"
import { DateRangePicker, RangeDatePickerRef } from "@/components/DatePicker"
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
              <Button className="w-full sm:w-fit">Застосувати</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
