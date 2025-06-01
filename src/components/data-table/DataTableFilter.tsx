"use client"

import { Button } from "@/components/Button"
import { Calendar } from "@/components/Calendar"
import { Checkbox } from "@/components/Checkbox"
import { DateRangePicker } from "@/components/DatePicker"
import { Input } from "@/components/Input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { cx, focusRing } from "@/lib/utils"
import { type FilterOption, type FilterType } from "@/types/table"
import { RiAddLine, RiCornerDownRightLine } from "@remixicon/react"
import { type Column } from "@tanstack/react-table"
import { uk } from "date-fns/locale"
import React, { useEffect, useState } from "react"
import {
  TRANSLATIONS_DATEPICKER,
  TRANSLATIONS_FILTER_LABELS,
} from "./constants"

interface DataTableFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title: string
  options?: readonly FilterOption[]
  type: FilterType
  displayMode?: "value" | "label"
  onFilterChange: (value: any) => void
  onRegister: (setValue: (value: any) => void) => void
}

export function DataTableFilter<TData, TValue>({
  column,
  title,
  options,
  type,
  displayMode,
  onFilterChange,
  onRegister,
}: DataTableFilterProps<TData, TValue>) {
  const [value, setValue] = useState<any>(column?.getFilterValue())
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    onRegister(setValue)
  }, [onRegister])

  const handleValueChange = (newValue: any) => {
    console.log("Filter value changed:", {
      columnId: column?.id,
      value: newValue,
      type,
    })
    setValue(newValue)

    const filterValue =
      newValue === "" || newValue === null ? undefined : newValue
    onFilterChange(filterValue)
  }

  const handleReset = (e: React.MouseEvent) => {
    if (value) {
      e.stopPropagation()
      handleValueChange(undefined)
      setSearchTerm("")
    }
  }

  const getFilterComponent = () => {
    switch (type) {
      case "text":
        return (
          <Input
            type="search"
            value={value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={TRANSLATIONS_FILTER_LABELS.text.placeholder}
            className="w-full"
          />
        )

      case "number":
        return (
          <div className="max-w-[222px] space-y-2">
            <Select
              value={value?.condition || ""}
              onValueChange={(condition) => {
                // При зміні умови не застосовуємо фільтр, якщо немає значення
                if (value?.value?.[0]) {
                  handleValueChange({
                    condition,
                    value: [value.value[0], value.value[1] || ""],
                  })
                } else {
                  // Просто зберігаємо умову без застосування фільтра
                  setValue({
                    condition,
                    value: ["", ""],
                  })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    TRANSLATIONS_FILTER_LABELS.number.selectCondition
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATIONS_FILTER_LABELS.number.conditions.map(
                  (condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            <div className="flex w-full items-center gap-2">
              <RiCornerDownRightLine
                className="size-4 shrink-0 text-gray-500"
                aria-hidden="true"
              />
              <Input
                disabled={!value?.condition}
                type="number"
                placeholder={TRANSLATIONS_FILTER_LABELS.number.placeholder}
                className="w-full"
                value={value?.value?.[0] || ""}
                onChange={(e) => {
                  const newValue = e.target.value
                  // Застосовуємо фільтр тільки якщо є значення
                  if (newValue) {
                    handleValueChange({
                      condition: value?.condition,
                      value: [
                        newValue,
                        value?.condition === "is-between"
                          ? value?.value?.[1] || ""
                          : "",
                      ],
                    })
                  } else {
                    // Якщо значення порожнє - скидаємо фільтр
                    handleValueChange(undefined)
                  }
                }}
              />
              {value?.condition === "is-between" && (
                <>
                  <span className="text-xs font-medium text-gray-500">
                    {TRANSLATIONS_FILTER_LABELS.number.and}
                  </span>
                  <Input
                    disabled={!value?.condition || !value?.value?.[0]}
                    type="number"
                    placeholder={TRANSLATIONS_FILTER_LABELS.number.placeholder}
                    className="w-full"
                    value={value?.value?.[1] || ""}
                    onChange={(e) => {
                      const newValue = e.target.value
                      // Застосовуємо фільтр тільки якщо є обидва значення
                      if (value?.value?.[0] && newValue) {
                        handleValueChange({
                          condition: value?.condition,
                          value: [value.value[0], newValue],
                        })
                      } else if (!newValue) {
                        // Якщо друге значення порожнє - повертаємося до звичайного фільтра
                        handleValueChange({
                          condition: value?.condition,
                          value: [value.value[0], ""],
                        })
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>
        )

      case "date":
        return (
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={value}
            selected={value}
            onSelect={handleValueChange}
            numberOfMonths={1}
            locale={uk}
            toDate={new Date()}
            weekStartsOn={1}
            footer={
              value ? (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-indigo-500">
                    {formatTimestamp({ date: value })}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleReset}
                  >
                    {TRANSLATIONS_DATEPICKER.cancel}
                  </Button>
                </div>
              ) : null
            }
          />
        )

      case "dateRange":
        return (
          // <Calendar
          //   initialFocus
          //   mode="range"
          //   defaultMonth={value?.from}
          //   selected={value}
          //   onSelect={handleValueChange}
          //   numberOfMonths={1}
          //   locale={uk}
          //   toDate={new Date()}
          //   weekStartsOn={1}
          //   footer={
          //     value?.from ? (
          //       <div className="flex items-center justify-between pt-2">
          //         <p className="text-sm text-indigo-500">
          //           {formatTimestamp({ date: value.from })}
          //           {value.to && ` - ${formatTimestamp({ date: value.to })}`}
          //         </p>
          //         <Button
          //           variant="ghost"
          //           size="sm"
          //           className="h-8 px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          //           onClick={handleReset}
          //         >
          //           {TRANSLATIONS_DATEPICKER.cancel}
          //         </Button>
          //       </div>
          //     ) : null
          //   }
          // />
          <DateRangePicker
            // value={value}
            onChange={handleValueChange}
            // className="w-full sm:w-fit"
            placeholder={TRANSLATIONS_FILTER_LABELS.dateRange.placeholder}
            fromDate={value?.from}
            toDate={value?.to}
            locale={uk}
            align="start"
            translations={TRANSLATIONS_DATEPICKER}
          />
        )

      case "boolean":
        return (
          <Select value={value || ""} onValueChange={handleValueChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={TRANSLATIONS_FILTER_LABELS.select.placeholder}
              />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={handleValueChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={TRANSLATIONS_FILTER_LABELS.select.placeholder}
              />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "multiselect": {
        const filteredOptions =
          options?.filter(
            (option) =>
              option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              String(option.value)
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
          ) ?? []

        return (
          <div className="max-w-[80vw] space-y-2">
            {(options?.length || 0) > 10 && (
              <Input
                type="search"
                placeholder={TRANSLATIONS_FILTER_LABELS.text.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            )}
            <div className="max-h-[200px] overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const optionId = `filter-${column?.id}-${option.value}`
                  return (
                    <div
                      key={optionId}
                      className="flex items-start gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="pt-0.5">
                        <Checkbox
                          id={optionId}
                          checked={
                            Array.isArray(value) &&
                            value.includes(String(option.value))
                          }
                          onCheckedChange={(checked) => {
                            const currentValues = Array.isArray(value)
                              ? value
                              : []
                            let newValues: string[]

                            if (checked) {
                              newValues = [
                                ...currentValues,
                                String(option.value),
                              ]
                            } else {
                              newValues = currentValues.filter(
                                (v) => v !== String(option.value),
                              )
                            }

                            // Якщо масив порожній - скидаємо фільтр повністю
                            if (newValues.length === 0) {
                              handleValueChange(undefined)
                            } else {
                              handleValueChange(newValues)
                            }
                          }}
                        />
                      </div>
                      <label
                        htmlFor={optionId}
                        className="flex-1 cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  )
                })
              ) : (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  {TRANSLATIONS_FILTER_LABELS.common.noResults}
                </div>
              )}
            </div>
          </div>
        )
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cx(
            "flex w-full items-center gap-x-1.5 whitespace-nowrap rounded-md border border-gray-300 px-2 py-1.5 font-medium text-gray-600 hover:bg-gray-50 sm:w-fit sm:text-xs dark:border-gray-700 dark:text-gray-400 hover:dark:bg-gray-900",
            !value && "border-dashed",
            focusRing,
          )}
        >
          <span aria-hidden="true" onClick={handleReset}>
            <RiAddLine
              className={cx(
                "-ml-px size-5 shrink-0 transition sm:size-4",
                value ? "rotate-45 hover:text-red-500" : "hover:text-green-500",
              )}
              aria-hidden="true"
            />
          </span>
          <span>{title}</span>
          {value && (
            <>
              <span className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                {type === "multiselect" && Array.isArray(value) ? (
                  <>
                    {value
                      .slice(0, 5)
                      .map((v) => {
                        const option = options?.find(
                          (opt) => String(opt.value) === v,
                        )
                        if (displayMode === "value") {
                          return v
                        }
                        return option?.label || v
                      })
                      .join(", ")}
                    {value.length > 5 && (
                      <span className="text-gray-500">
                        &nbsp;та {value.length - 5} інших
                      </span>
                    )}
                  </>
                ) : type === "dateRange" && value ? (
                  <>
                    {value.from && formatTimestamp({ date: value.from })}
                    {value.to && ` - ${formatTimestamp({ date: value.to })}`}
                  </>
                ) : type === "date" && value ? (
                  <>{value && formatTimestamp({ date: value })}</>
                ) : type === "number" && value?.condition ? (
                  <>
                    {value.condition === "is-equal-to" && `= ${value.value[0]}`}
                    {value.condition === "is-greater-than" &&
                      `> ${value.value[0]}`}
                    {value.condition === "is-less-than" &&
                      `< ${value.value[0]}`}
                    {value.condition === "is-between" &&
                      `${value.value[0]} - ${value.value[1]}`}
                  </>
                ) : type === "select" ? (
                  options?.find((opt) => String(opt.value) === value)?.label ||
                  value
                ) : type === "boolean" ? (
                  options?.find((opt) => String(opt.value) === value)?.label ||
                  value
                ) : (
                  value
                )}
              </div>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="z-20 p-2">
        {getFilterComponent()}
      </PopoverContent>
    </Popover>
  )
}
