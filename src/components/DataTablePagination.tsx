import { Button } from "@/components/Button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu"
import { cx, formatters } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length
  const currentPage = table.getState().pagination.pageIndex
  const currentPageSize = table.getState().pagination.pageSize
  const firstRowIndex = currentPage * currentPageSize + 1
  const lastRowIndex = Math.min(totalRows, firstRowIndex + currentPageSize - 1)
  const totalPages = table.getPageCount()
  const showRange = totalRows > currentPageSize

  const pageSizeOptions = [
    20,
    50,
    100,
    500,
    1000,
    { value: totalRows, label: "Усі" },
  ]

  const paginationButtons = [
    {
      icon: ChevronsLeft,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      srText: "First page",
      mobileView: "hidden sm:block",
    },
    {
      icon: ChevronLeft,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      srText: "Previous page",
      mobileView: "",
    },
    {
      icon: ChevronRight,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      srText: "Next page",
      mobileView: "",
    },
    {
      icon: ChevronsRight,
      onClick: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      srText: "Last page",
      mobileView: "hidden sm:block",
    },
  ]

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-x-6 lg:gap-x-8">
        <div className="text-sm tabular-nums text-gray-500">
          <span className="hidden lg:inline">Показано: </span>
          {showRange ? (
            <>
              {firstRowIndex}-{lastRowIndex} з{" "}
            </>
          ) : null}
          {formatters.unit(totalRows)}
        </div>
        <div className="flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 gap-x-1.5">
                {currentPageSize === totalRows ? "Усі" : currentPageSize}
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  className="ml-1 size-4 shrink-0 opacity-50"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[100px]">
              {pageSizeOptions.map((option) => {
                const value = typeof option === "number" ? option : option.value
                const label = typeof option === "number" ? option : option.label

                return (
                  <DropdownMenuCheckboxItem
                    key={value}
                    checked={currentPageSize === value}
                    onCheckedChange={() => {
                      table.setPageSize(value)
                      if (currentPage > Math.ceil(totalRows / value) - 1) {
                        table.setPageIndex(0)
                      }
                    }}
                    className="justify-center"
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex items-center gap-x-6 lg:gap-x-8">
        <p className="text-sm tabular-nums text-gray-500">
          <span className="hidden lg:inline">Сторінка</span> {currentPage + 1} з{" "}
          {totalPages}
        </p>
        <div className="flex items-center gap-x-1.5">
          {paginationButtons.map((button, index) => (
            <Button
              key={index}
              variant="secondary"
              className={cx(button.mobileView, "p-1.5")}
              onClick={button.onClick}
              disabled={button.disabled}
            >
              <span className="sr-only">{button.srText}</span>
              <button.icon className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
