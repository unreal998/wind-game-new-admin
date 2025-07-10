import { fetchUserPermissions } from "@/stores/admin/useAdminReferralsStore"
import { roleSelector, useUserStore } from "@/stores/useUserStore"
import { useEffect, useState } from "react"

export default function useIsAvailableToWrite() {
  const [isAvialableToWrite, setIsAvialableToWrite] = useState<boolean>()
  const userRole = useUserStore(roleSelector)

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await fetchUserPermissions()
        setIsAvialableToWrite(
          data.permissions.includes("write") &&
            (userRole === "admin" || userRole === "teamlead"),
        )
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }

    loadPermissions()
  }, [])

  return { isAvialableToWrite }
}
