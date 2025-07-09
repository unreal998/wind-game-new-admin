import { fetchUserPermissions } from "@/stores/admin/useAdminReferralsStore"
import { useEffect, useState } from "react"

export default function useIsAvailableToWrite() {
  const [isAvialableToWrite, setIsAvialableToWrite] = useState()

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await fetchUserPermissions()
        setIsAvialableToWrite(data.permissions.includes("write"))
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }

    loadPermissions()
  }, [])

  return { isAvialableToWrite }
}
