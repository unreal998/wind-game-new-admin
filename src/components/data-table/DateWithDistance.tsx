import { useFormattedDistance } from "@/hooks/useFormattedDistance"
import { formatTimestamp, type FormatOption } from "../../hooks/formatTimestamp"

// Компонент для відображення дати з відносним часом
export function DateWithDistance({
  date,
  formatOption = "date",
}: {
  date: string
  formatOption?: FormatOption
}) {
  const formatDistance = useFormattedDistance()
  
  if (!date) return "-"

  return (
    <div className="flex flex-col">
      <span>{formatTimestamp({ date, formatOption })}</span>
      <span className="text-xs text-gray-500">{formatDistance(date)}</span>
    </div>
  )
}
