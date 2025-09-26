export type CategoryType = "currency" | "unit"

export const categories = [
  {
    title: "registrations",
    label: "Реєстрації",
    type: "unit" as const,
  },
  {
    title: "deposits",
    label: "Поповнення TON",
    type: "currency" as const,
  },
  {
    title: "withdrawals",
    label: "Вивід TON",
    type: "currency" as const,
  },
  {
    title: "turxBalance",
    label: "кВт Пропрозиція",
    type: "currency" as const,
  },
  {
    title: "tonBalance",
    label: "TON Баланс",
    type: "currency" as const,
  },
  {
    title: "potentialOutput",
    label: "Прогнозована сума виплат",
    type: "currency" as const,
  },
  {
    title: "referalsKWT",
    label: "кВт Рефералів",
    type: "currency" as const,
  },
  {
    title: "referalsTon",
    label: "TON Рефералів",
    type: "currency" as const,
  },
] as const

export type PeriodValue =
  | "previous-period"
  | "previous-month"
  | "last-year"
  | "no-comparison"
