import { useAdminWithdrawalsStore } from "@/stores/admin/useAdminWithdrawalsStore"
import { Button } from "@/components"
import React from "react"

type Props = {
  id: string
}

export default function WithDrawalActions({ id }: Props) {
  const { updateWithDrawStatus } = useAdminWithdrawalsStore()

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className="bg-green-600"
        onClick={() => {
          updateWithDrawStatus(id, "completed")
        }}
      >
        Погодити
      </Button>
      <Button
        size="sm"
        className="bg-red-600"
        onClick={() => {
          updateWithDrawStatus(id, "declined")
        }}
      >
        Відмінити
      </Button>
    </div>
  )
}
