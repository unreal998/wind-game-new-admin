import { Tooltip } from "@/components/Tooltip"
import { Metric, MetricsStats } from "@/types/stats"
import { type TableColumn } from "@/types/table"
import { formatAmount } from "@/utils/amountFormatter"
import { createColumnHelper } from "@tanstack/react-table"
import { CircleMinus, CirclePlus, RefreshCw, Users } from "lucide-react"

const columnHelper = createColumnHelper<MetricsStats>()

export const statsMetrics: Metric[] = [
  {
    key: "referrals_count",
    label: "Користувачі",
    format: false,
    icon: Users,
    info: "Кількість користувачів",
  },
  {
    key: "total_deposits",
    label: "Поповнення TON",
    format: true,
    icon: CirclePlus,
    info: "Загальна сума поповнень",
  },
  {
    key: "total_withdrawals",
    label: "Вивід",
    format: true,
    icon: CircleMinus,
    info: "Загальна сума виводів",
  },
  {
    key: "current_revenue",
    label: "Баланс",
    format: true,
    icon: RefreshCw,
    info: "Поточний баланс: поповнення - вивід",
  },
] as const

function renderTitle(metric: Metric | undefined) {
  if (!metric) return null
  return (
    <Tooltip
      content={metric.info}
      className="max-w-44 text-xs"
      triggerAsChild={true}
    >
      <div className="flex items-center gap-2">
        {metric.icon && (
          <metric.icon className="size-4 shrink-0 text-gray-400 dark:text-gray-500" />
        )}
        {metric.label}
      </div>
    </Tooltip>
  )
}

function renderValue(metric: Metric | undefined, value: string | number) {
  if (!metric) return null
  return (
    <div className="whitespace-nowrap">
      {metric.format ? formatAmount(value, { hide: true }) : value}
    </div>
  )
}

export const statsColumns: TableColumn<MetricsStats>[] = [
  columnHelper.accessor("metric", {
    id: "metric",
    header: "Метрика",
    cell: ({ getValue }) => {
      const metric = statsMetrics.find((m) => m.key === getValue())
      return renderTitle(metric)
    },
    enableSorting: false,
    meta: {
      exportValue: (row) => {
        const metric = statsMetrics.find((m) => m.key === row.metric)
        return metric?.label || row.metric
      },
    },
  }),
  columnHelper.accessor("total", {
    id: "total",
    header: "Всього",
    cell: ({ getValue, row }) => {
      const metric = statsMetrics.find((m) => m.key === row.original.metric)
      return renderValue(metric, getValue())
    },
    enableSorting: false,
    meta: {
      exportValue: (row) => row.total,
      exportAlign: "right",
      exportWidth: 15,
    },
  }),
]
