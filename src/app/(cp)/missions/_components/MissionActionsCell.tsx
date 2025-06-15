import { useState } from "react"
import { fetchDeleteMission, Mission } from "./fetchMissions"

const MissionActionsCell = ({
  mission,
  table,
}: {
  mission: Mission
  table: any
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await fetchDeleteMission(mission.id)
      await table.options.meta?.onRefetch?.()
    } catch (err) {
      console.error("Помилка при видаленні місії", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center justify-center rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-80"
      style={{ minWidth: 80 }}
    >
      {isDeleting ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          />
        </svg>
      ) : (
        "Видалити"
      )}
    </button>
  )
}

export default MissionActionsCell
