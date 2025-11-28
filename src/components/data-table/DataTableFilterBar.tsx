"use client"

import { Button } from "@/components/Button"
import { Searchbar } from "@/components/Searchbar"
import { DataTableFilterBarProps } from "@/types/table"
import { RiResetLeftLine } from "@remixicon/react"
import { useQueryState } from "nuqs"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { TRANSLATIONS_FILTER_LABELS } from "./constants"
import { DataTableFilter } from "./DataTableFilter"
import { DataTableViewOptions } from "./DataTableViewOptions"
import { ExportButton } from "./ExportButton"

export function DataTableFilterBar<TData extends Record<string, any>>({
  table,
  filterableColumns,
  title,
  onSearchChange,
}: DataTableFilterBarProps<TData> & { onSearchChange?: (search: string) => void }) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useQueryState("filters")
  const filterRefs = useRef<Record<string, { setValue: (value: any) => void }>>(
    {},
  )

  // Реєстрація компонента фільтра
  const registerFilter = useCallback(
    (columnId: string, setValue: (value: any) => void) => {
      filterRefs.current[columnId] = { setValue }
    },
    [],
  )

  // Скидання всіх фільтрів
  const handleResetFilters = useCallback(() => {
    // Скидаємо фільтри в таблиці
    table.resetColumnFilters()
    table.setGlobalFilter(undefined)

    // Скидаємо значення в компонентах фільтрів
    Object.values(filterRefs.current).forEach((filter) => {
      filter.setValue(undefined)
    })

    // Скидаємо URL
    setFilters(null)

    // // Приховуємо панель фільтрів
    // setShowFilters(false)
  }, [table, setFilters])

  // Встановлення одного фільтра
  const handleFilterChange = useCallback(
    (columnId: string, value: any) => {
      const column = table.getColumn(columnId)
      if (!column) return

      // Встановлюємо значення в таблиці
      column.setFilterValue(value)

      // Оновлюємо URL
      const currentFilters = filters ? JSON.parse(filters) : {}

      if (value === undefined) {
        delete currentFilters[columnId]
      } else {
        currentFilters[columnId] = value
      }

      // Зберігаємо в URL тільки якщо є активні фільтри
      if (Object.keys(currentFilters).length > 0) {
        setFilters(JSON.stringify(currentFilters))
      } else {
        handleResetFilters()
      }
    },
    [table, filters, setFilters, handleResetFilters],
  )

  // Застосування фільтрів з URL
  useEffect(() => {
    // Спочатку скидаємо всі значення в компонентах фільтрів
    Object.values(filterRefs.current).forEach((filter) => {
      filter.setValue(undefined)
    })

    // Скидаємо всі фільтри в таблиці
    table.resetColumnFilters()

    if (filters) {
      try {
        const savedFilters = JSON.parse(filters)

        if (Object.keys(savedFilters).length > 0) {
          // Встановлюємо нові фільтри
          Object.entries(savedFilters).forEach(([columnId, value]) => {
            // Оновлюємо значення в таблиці
            table.getColumn(columnId)?.setFilterValue(value)

            // Оновлюємо значення в компоненті фільтра
            filterRefs.current[columnId]?.setValue(value)
          })

          // Показуємо панель фільтрів
          setShowFilters(true)
        } else {
          setShowFilters(false)
        }
      } catch (error) {
        console.error("Error parsing filters from URL:", error)
        handleResetFilters()
      }
    } else {
      handleResetFilters()
    }
  }, [filters, table, handleResetFilters])

  // Оптимізований пошук з дебаунсом
  const debouncedSearch = useDebouncedCallback((value: string, callback?: (search: string) => void) => {
    if (typeof callback === "function") {
      callback(value)
    } else {
      table.setGlobalFilter(value || undefined)
    }
  }, 300)

  // Обробник події зміни input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>, callback?: (search: string) => void) => {
    const value = event.target.value.trim()
    debouncedSearch(value, callback)
  }

  // Отримуємо поточні налаштування видимості та порядку колонок
  const columnVisibility = table.getState().columnVisibility
  const columnOrder = table.getState().columnOrder

  // Фільтруємо та сортуємо колонки відповідно до налаштувань таблиці
  const visibleFilterableColumns = filterableColumns
    .filter((column) => {
      // Показуємо фільтр тільки якщо колонка видима
      return columnVisibility[column.id] !== false
    })
    .sort((a, b) => {
      // Сортуємо фільтри в тому ж порядку, що й колонки
      const aIndex = columnOrder.indexOf(a.id)
      const bIndex = columnOrder.indexOf(b.id)

      // Якщо колонка не знайдена в columnOrder, ставимо її в кінець
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1

      return aIndex - bIndex
    })

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <Searchbar
          type="search"
          placeholder="Search..."
          onChange={(event) => handleSearchChange(event, onSearchChange ?? undefined)}
          className="w-full sm:max-w-[350px] [&>input]:h-[34px]"
        />
        {title && <h3 className="text-base font-bold">{title}</h3>}
        <div className="flex items-center gap-2">
          {/* <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            className="flex min-h-[34px] gap-x-2 px-2 py-1.5 text-sm sm:text-xs"
            disabled={isFiltered && showFilters}
          >
            {showFilters ? (
              <RiFilterOffLine className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <RiFilterLine className="size-4 shrink-0" aria-hidden="true" />
            )}
            <span className="hidden sm:block">Фільтри</span>
          </Button> */}
          <DataTableViewOptions table={table} />
          <ExportButton
            data={table.getCoreRowModel().rows.map((row) => row.original)}
            columns={table.getAllColumns().map((column) => column.columnDef)}
          />
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {visibleFilterableColumns.map((column) => (
            <DataTableFilter
              key={column.id}
              column={table.getColumn(column.id)}
              title={column.title}
              options={column.options}
              type={column.type}
              displayMode={column.displayMode}
              onFilterChange={(value) => handleFilterChange(column.id, value)}
              onRegister={(setValue) => registerFilter(column.id, setValue)}
            />
          ))}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="flex h-[30px] items-center gap-x-2 border border-none px-2 text-sm font-semibold text-indigo-600 dark:text-indigo-500"
            >
              <RiResetLeftLine className="size-4 shrink-0" aria-hidden="true" />
              <span>{TRANSLATIONS_FILTER_LABELS.common.clearAll}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
