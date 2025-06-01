import { formatDistance } from "date-fns"
import * as dateFnsLocales from "date-fns/locale"

export function useFormattedDistance() {
  const dateFnsLocale =
    dateFnsLocales["uk" as keyof typeof dateFnsLocales] || dateFnsLocales.enGB

  return (utcDate: string | Date) => {
    if (!utcDate) return

    return formatDistance(utcDate, new Date(), {
      addSuffix: true,
      // includeSeconds: true,
      locale: dateFnsLocale,
    })
  }
}
