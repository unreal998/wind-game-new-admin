import {
  type Column,
  type ColumnDef,
  type FilterFn,
  type RowData,
  type Table,
} from "@tanstack/react-table"

// Тип для колонок таблиці
export type TableColumn<TData> =
  | ColumnDef<TData, any> // Для звичайних колонок з даними
  | (Omit<ColumnDef<TData, any>, "accessorKey" | "accessorFn"> & {
      // Для display колонок
      id: string
      cell?: ColumnDef<TData, any>["cell"]
    })

// Розширюємо типи TanStack Table
declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    displayName?: string
    exportValue?: (row: TData) => string | number | null
    exportWidth?: number
    exportHeader?: string
    exportAlign?: "left" | "right" | "center"
  }

  interface FilterFns {
    text: FilterFn<any>
    number: FilterFn<any>
    boolean: FilterFn<any>
    select: FilterFn<any>
    multiselect: FilterFn<any>
    date: FilterFn<any>
    dateRange: FilterFn<any>
    fuzzy: FilterFn<unknown>
  }

  interface TableMeta<TData extends RowData> {
    onRefetch?: () => Promise<void>
  }
}

export type FilterType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "dateRange"
  | "boolean"
  | "fuzzy"

export interface FilterOption {
  readonly label: string
  readonly value: string
}

export interface FilterableColumn {
  id: string
  title: string
  type: FilterType
  options?: readonly FilterOption[]
  displayMode?: "value" | "label"
}

export interface DataTableFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title: string
  options?: FilterOption[]
  type: FilterType
  onFilterChange: (value: any) => void
}

export interface DataTableFilterBarProps<TData extends Record<string, any>> {
  table: Table<TData>
  filterableColumns: FilterableColumn[]
  title?: string
  isExport?: boolean
}

export interface DataTableProps<TData> {
  data: TData[]
  columns: TableColumn<TData>[]
  filterableColumns?: FilterableColumn[]
  aggregations?: {
    columnId: string
    type: "sum" | "count"
    onResult: (value: number) => void
  }[]
  onRefetch?: () => Promise<void>
  isLoading?: boolean
  onRowClick?: (row: TData) => void
  openSidebarOnRowClick?: boolean
}

// Додамо константу для опцій булевого фільтру
export const BOOLEAN_OPTIONS = [
  { value: "true", label: "Так" },
  { value: "false", label: "Ні" },
] as const
