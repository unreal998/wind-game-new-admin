import { formatInTimeZone } from "date-fns-tz"

export type FormatOption =
  | "date"
  | "timeWithSeconds"
  | "timeWithoutSeconds"
  | "dateTimeWithSeconds"
  | "dateTimeWithoutSeconds"

type TimestampFormatProps = {
  date: string | null
  formatOption?: FormatOption
}

const localTimeZone = process.env.NEXT_PUBLIC_TIMEZONE || "Europe/Kiev"

export function formatTimestamp({
  date,
  formatOption = "date",
}: TimestampFormatProps): string {
  if (!date) return "-"

  // Перетворюємо рядок з UTC на об'єкт Date
  const utcDate = new Date(date)

  // Визначаємо формат залежно від вибраної опції
  let formatString = "dd.MM.yyyy HH:mm:ss" // Стандартний формат

  switch (formatOption) {
    case "date":
      formatString = "dd.MM.yyyy"
      break
    case "timeWithSeconds":
      formatString = "HH:mm:ss"
      break
    case "timeWithoutSeconds":
      formatString = "HH:mm"
      break
    case "dateTimeWithSeconds":
      formatString = "dd.MM.yyyy HH:mm:ss"
      break
    case "dateTimeWithoutSeconds":
      formatString = "dd.MM.yyyy HH:mm"
      break
    default:
      break
  }

  // Форматуємо дату у обраній часовій зоні
  return formatInTimeZone(utcDate, localTimeZone, formatString)
}
