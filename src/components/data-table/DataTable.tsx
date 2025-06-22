"use client"

import { formatTimestamp } from "@/hooks/formatTimestamp"
import { formatAmount } from "@/utils/amountFormatter"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/Table"
import { useEffect, useState } from "react"

import { DataTableBulkEditor } from "./DataTableBulkEditor"

import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { DataTableFilterBar } from "./DataTableFilterBar"
import { DataTablePagination } from "./DataTablePagination"

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { LoadingState } from "@/components/LoadingState"
import { useTableSettings } from "@/hooks/admin/useTableSettings"
import { cx } from "@/lib/utils"
import { FilterableColumn, type TableColumn } from "@/types/table"
import { rankItem } from "@tanstack/match-sorter-utils"
import { DateRange } from "react-day-picker"
import { interval, isWithinInterval } from "date-fns"

interface DataTableProps<TData> {
  data: TData[]
  columns: TableColumn<TData>[]
  simple?: boolean
  filterableColumns?: FilterableColumn[]
  aggregations?: {
    columnId: string
    type: "sum" | "count"
    onResult: (formattedValue: string | number) => void
  }[]
  onRefetch?: () => Promise<void>
  isLoading?: boolean
  openSidebarOnRowClick?: boolean
  onRowClick?: (row: TData) => void
}

// Функція для форматування значень для пошуку
const formatSearchValue = (key: string, value: any): string => {
  if (value === null || value === undefined) return ""

  // Форматування дат
  if (
    value instanceof Date ||
    (typeof value === "string" && !isNaN(Date.parse(value)))
  ) {
    const date = String(value)
    return formatTimestamp({ date })
  }

  // Форматування чисел
  if (typeof value === "number") {
    // Для поля progress повертаємо ціле значення з відсотком
    if (key === "progress") {
      return `${String(Math.round(value))}%`
    }
    // Для полів з сумами додаємо обидва варіанти - з валютою і без
    if (
      [
        "amount",
        "commission",
        "final_amount",
        "earned_amount",
        "total_balance",
        "total_deposits",
        "total_withdrawals",
        "total_investment_earnings",
      ].includes(key)
    ) {
      return formatAmount(value)
    }
    // Для інших числових полів округляємо до 2 знаків
    return value.toFixed(2)
  }

  // Форматування імені користувача
  if (typeof value === "object") {
    if ("first_name" in value || "last_name" in value || "id" in value) {
      // Якщо це об'єкт profile, збираємо всі потрібні поля
      const profileData = []
      if ("id" in value) profileData.push(value.id)
      if ("first_name" in value) profileData.push(value.first_name)
      if ("last_name" in value) profileData.push(value.last_name)
      if ("username" in value) profileData.push(value.username)

      return profileData.filter(Boolean).join(" ").toLowerCase()
    }

    // Для інших об'єктів рекурсивно обробляємо значення
    return Object.values(value)
      .filter((v) => v !== null && v !== undefined)
      .map((v) => formatSearchValue("", v))
      .join(" ")
  }

  // console.log(value)

  return String(value).trim()
}

// Функція для створення пошукового рядка
const createSearchString = (data: Record<string, any>): string => {
  return Object.entries(data)
    .map(([key, value]) => formatSearchValue(key, value))
    .join(" ")
    .toLowerCase()
}

export function DataTable<TData extends Record<string, any>>({
  columns,
  data,
  simple,
  filterableColumns = [],
  aggregations,
  onRefetch,
  isLoading,
  onRowClick,
  openSidebarOnRowClick = false,
  selectedDateRange,
}: DataTableProps<TData> & { selectedDateRange?: DateRange }) {
  const [pagination, setPagination] = useState({
    pageSize: simple ? 100 : 10,
    pageIndex: 0,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { settings, updateSettings } = useTableSettings()

  const [rowSelection, setRowSelection] = useState({})

  const [globalFilter, setGlobalFilter] = useState("")

  const [preparedData, setPreparedData] =
    useState<(TData & { _searchable?: string })[]>(data)
  const [, setActiveRow] = useState<TData | null>(null)
  useEffect(() => {
    const prepared = data.map((item) => ({
      ...item,
      _searchable: createSearchString(item),
    }))

    if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
      const selectedInterval = interval(
        selectedDateRange.from,
        selectedDateRange.to,
      )
      const sortedByPeriod = prepared.filter((item) => {
        return isWithinInterval(item.created_at, selectedInterval)
      })
      setPreparedData(sortedByPeriod)
      return
    }

    setPreparedData(prepared)
  }, [data, selectedDateRange])

  const table = useReactTable({
    data: preparedData,
    columns,
    state: {
      sorting: settings.sorting,
      rowSelection,
      columnVisibility: settings.columnVisibility,
      columnOrder: settings.columnOrder,
      pagination,
      columnFilters,
      globalFilter,
    },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    onSortingChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(settings.sorting) : updater
      updateSettings({ sorting: newState })
    },
    onColumnVisibilityChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(settings.columnVisibility)
          : updater
      updateSettings({ columnVisibility: newState })
    },
    onColumnOrderChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(settings.columnOrder) : updater
      updateSettings({ columnOrder: newState })
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    enableColumnFilters: true,
    enableFilters: true,
    filterFns: {
      fuzzy: (row, columnId, value, addMeta) => {
        const itemRank = rankItem(String(row.getValue(columnId)), String(value))
        addMeta({ itemRank })
        return itemRank.passed
      },
      text: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)
        return String(value)
          .toLowerCase()
          .includes(String(filterValue).toLowerCase())
      },
      number: (row, columnId, filterValue) => {
        if (!filterValue?.condition || !filterValue.value) return true
        const value = Number(row.getValue(columnId))
        if (isNaN(value)) return false

        switch (filterValue.condition) {
          case "is-equal-to":
            return value === Number(filterValue.value[0])
          case "is-greater-than":
            return value > Number(filterValue.value[0])
          case "is-less-than":
            return value < Number(filterValue.value[0])
          case "is-between":
            return (
              value >= Number(filterValue.value[0]) &&
              value <= Number(filterValue.value[1])
            )
          default:
            return true
        }
      },
      boolean: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const value = row.getValue(columnId)
        // Конвертуємо обидва значення в boolean для коректного порівняння
        const booleanValue = value === true || value === "true"
        const filterBooleanValue = filterValue === "true"
        return booleanValue === filterBooleanValue
      },
      select: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const value = row.getValue(columnId)
        return value === filterValue
      },
      multiselect: (row, columnId, filterValue) => {
        if (!filterValue?.length) return true
        const value = row.getValue(columnId)
        return filterValue.includes(String(value))
      },
      date: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const value = row.getValue(columnId) as string | number | Date
        if (!value) return false

        const date = new Date(value)
        date.setHours(0, 0, 0, 0)

        const filterDate = new Date(filterValue as string | number | Date)
        filterDate.setHours(0, 0, 0, 0)

        return date.getTime() === filterDate.getTime()
      },
      dateRange: (row, columnId, filterValue) => {
        if (!filterValue?.from || !filterValue?.to) return true
        const value = row.getValue(columnId) as string | number | Date
        if (!value) return false

        const date = new Date(value)
        date.setHours(0, 0, 0, 0)

        const startDate = new Date(filterValue.from as string | number | Date)
        startDate.setHours(0, 0, 0, 0)

        const endDate = new Date(filterValue.to as string | number | Date)
        endDate.setHours(23, 59, 59, 999)

        return date >= startDate && date <= endDate
      },
    },
    globalFilterFn: (row, _columnId, value, _addMeta) => {
      const searchable = (row.original as any)._searchable
      if (!searchable) return false

      const searchTerms = String(value)
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean)

      if (searchTerms.length === 0) return true

      const matches = searchTerms.every((term) => searchable.includes(term))

      if (matches) {
        console.group("Знайдено співпадіння:")
        console.log("Пошуковий запит:", searchTerms)
        console.log("Рядок для пошуку:", searchable)
        console.log("Оригінальні дані:", row.original)

        // Показуємо, де саме знайдено кожен терм
        searchTerms.forEach((term) => {
          const index = searchable.indexOf(term)
          if (index > -1) {
            console.log(
              `Терм "${term}" знайдено в позиції ${index}:`,
              searchable.substring(Math.max(0, index - 20), index) +
                "[" +
                term +
                "]" +
                searchable.substring(
                  index + term.length,
                  index + term.length + 20,
                ),
            )
          }
        })
        console.groupEnd()
      }

      return matches
    },
    onGlobalFilterChange: setGlobalFilter,
    meta: {
      onRefetch,
    },
  })

  useEffect(() => {
    if (settings.columnOrder.length > 0) {
      table.setColumnOrder(settings.columnOrder)
    }
  }, [settings.columnOrder, table])

  // Оновлюємо агрегації при зміні фільтрованих даних
  useEffect(() => {
    if (!isLoading && aggregations) {
      const filteredRows = table.getFilteredRowModel().rows

      aggregations.forEach(({ columnId, type, onResult }) => {
        const value = filteredRows.reduce((acc, row) => {
          const cellValue = row.getValue(columnId)
          if (typeof cellValue === "number" && !isNaN(cellValue)) {
            return type === "sum" ? acc + cellValue : acc + 1
          }
          return acc
        }, 0)

        // Форматуємо значення в залежності від типу агрегації
        const formattedValue = type === "sum" ? formatAmount(value) : value
        onResult(formattedValue)
      })
    }
  }, [isLoading, aggregations, columnFilters, globalFilter, table])

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className={cx(!simple && "flex max-h-[calc(100vh-90px)] flex-col")}>
      {!simple && (
        <DataTableFilterBar
          table={table}
          filterableColumns={filterableColumns}
        />
      )}
      <div className="relative h-full overflow-x-auto">
        <Table className="border-none">
          <TableHead
            className={cx(
              !simple &&
                "sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:bg-[#090E1A]/95 dark:supports-[backdrop-filter]:bg-[#090E1A]/75",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeaderCell
                    key={header.id}
                    colSpan={header.colSpan}
                    className="whitespace-nowrap py-1"
                  >
                    <DataTableColumnHeader
                      column={header.column}
                      title={flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      className={cx(simple && "py-2")}
                    />
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => {
                    if (openSidebarOnRowClick) {
                      setActiveRow(row.original)
                      onRowClick?.(row.original)
                    }
                  }}
                  className={cx(
                    "group cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-900",
                  )}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={cx(
                        "relative whitespace-nowrap py-2 text-gray-700 first:w-10 dark:text-gray-300",
                        index === 0 &&
                          row.getIsSelected() &&
                          "relative before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-indigo-500",
                        // cell.id.includes("actions") &&
                        //   "sticky right-0 before:inset-0 before:-left-4 before:w-4 before:bg-gradient-to-r before:from-gray-50/0 before:to-gray-50 group-hover:bg-gray-50 group-hover:before:absolute before:dark:from-gray-900/0 before:dark:to-gray-900 group-hover:dark:bg-gray-900",
                        cell.column.columnDef.meta?.className,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  {table.getState().columnFilters.length
                    ? "Немає результатів"
                    : "Немає даних"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTableBulkEditor table={table} rowSelection={rowSelection} />
      </div>
      {simple ? null : <DataTablePagination table={table} />}
    </div>
  )
}
