export type CategoryType = "currency" | "unit";

export const categories = [
    {
        title: "registrations",
        label: "Реєстрації",
        type: "unit" as const,
    },
    {
        title: "deposits",
        label: "Поповнення",
        type: "currency" as const,
    },
    {
        title: "withdrawals",
        label: "Вивід",
        type: "currency" as const,
    },
] as const;

export type PeriodValue =
    | "previous-period"
    | "previous-month"
    | "last-year"
    | "no-comparison";
