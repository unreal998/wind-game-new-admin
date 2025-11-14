"use client"

import { Button } from "@/components/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu"
import { type Transaction } from "@/types/transaction"
import {
  RiDraftLine,
  RiMoreFill,
} from "@remixicon/react"
import { useState } from "react"
import { EditTransactionDrawer } from "./EditTransactionDrawer"

interface DataTableRowActionsProps {
  orderId?: number
  transaction?: Transaction
  transactionStatus?: string
  onRefetch?: () => Promise<void>
}

export function DataTableRowActions({
  transaction,
  onRefetch,
}: DataTableRowActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editTransactionId, setEditTransactionId] = useState<string | null>(
    null,
  )


  const handleEditTransaction = () => {
    setMenuOpen(false)
    if (transaction) {
      setEditTransactionId(transaction.id)
    }
  }

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group aspect-square p-1.5 opacity-0 hover:border hover:border-gray-300 group-hover:opacity-100 data-[state=open]:border-gray-300 data-[state=open]:bg-gray-50 hover:dark:border-gray-700 data-[state=open]:dark:border-gray-700 data-[state=open]:dark:bg-gray-900"
          >
            <RiMoreFill
              className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700 group-hover:dark:text-gray-300 group-data-[state=open]:dark:text-gray-300"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">

          {transaction && (
            <DropdownMenuItem onClick={handleEditTransaction}>
              <RiDraftLine className="mr-2 size-4" />
              <span>Редагувати транзакцію</span>
            </DropdownMenuItem>
          )}

        
        </DropdownMenuContent>
      </DropdownMenu>

      {transaction && (
        <EditTransactionDrawer
          transactionId={editTransactionId || ""}
          onClose={() => setEditTransactionId(null)}
          onUpdate={onRefetch}
        />
      )}
    </div>
  )
}
