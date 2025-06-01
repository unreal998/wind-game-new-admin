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
// import { EditProfileDrawer } from "./EditProfileDrawer"
import { EditTransactionDrawer } from "./EditTransactionDrawer"

interface DataTableRowActionsProps {
  orderId?: number
  // profileId?: string
  // userId: number | null | undefined
  transaction?: Transaction
  transactionStatus?: string
  onRefetch?: () => Promise<void>
}

export function DataTableRowActions({
  // profileId,
  // userId,
  transaction,
  onRefetch,
}: DataTableRowActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  // const [editProfileId, setEditProfileId] = useState<string | null>(null)
  const [editTransactionId, setEditTransactionId] = useState<string | null>(
    null,
  )
  // const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)

  // const handleEditProfile = () => {
  //   setMenuOpen(false)
  //   setEditProfileId(profileId || null)
  // }

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
          {/* {fundStatus === "pending" && fund && (
            <>
              <DropdownMenuItem
                onClick={() => handleFundAction("approve")}
                className="text-green-600 dark:text-green-500"
              >
                <RiCheckLine className="mr-2 size-4" />
                <span>Підтвердити</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFundAction("reject")}
                className="text-red-600 dark:text-red-500"
              >
                <RiCloseLine className="mr-2 size-4" />
                <span>Відхилити</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {transactionStatus === "pending" && transaction && (
            <>
              <DropdownMenuItem
                onClick={() => handleConfirmTransaction("complete")}
                className="text-green-600 dark:text-green-500"
              >
                <RiCheckLine className="mr-2 size-4" />
                <span>Підтвердити</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleConfirmTransaction("cancel")}
                className="text-red-600 dark:text-red-500"
              >
                <RiCloseLine className="mr-2 size-4" />
                <span>Відхилити</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )} */}

          {transaction && (
            <DropdownMenuItem onClick={handleEditTransaction}>
              <RiDraftLine className="mr-2 size-4" />
              <span>Редагувати транзакцію</span>
            </DropdownMenuItem>
          )}

          {/* {fund && (
            <DropdownMenuItem onClick={handleEditFund}>
              <RiDraftLine className="mr-2 size-4" />
              <span>Редагувати інвестицію</span>
            </DropdownMenuItem>
          )} */}

          {/* {profileId && (
            <DropdownMenuItem onClick={handleEditProfile}>
              <RiUserLine className="mr-2 size-4" />
              Редагувати профіль
            </DropdownMenuItem>
          )} */}

          {/* {userId && (
            <>
              <DropdownMenuItem onClick={handleViewDashboard}>
                <RiKey2Line className="mr-2 size-4" />
                Авторизуватися
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleSendMessage}>
                <RiMailLine className="mr-2 size-4" />
                Написати повідомлення
              </DropdownMenuItem>
            </>
          )} */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <div
        className={cx(
          "absolute right-full top-1/2 -translate-y-1/2",
          "hidden h-full items-center space-x-2 bg-gray-50 group-hover:flex dark:bg-gray-900",
          // "shadow-[-8px_0_6px_-4px_rgba(0,0,0,0.05)]",
          // "dark:shadow-[-8px_0_6px_-4px_rgba(0,0,0,0.2)]",
        )}
      >
        <Button
          className="rounded px-2 py-1"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          Bulk edit
        </Button>
        <Button
          className="rounded px-2 py-1"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          Delete all
        </Button>
      </div> */}

      {transaction && (
        <EditTransactionDrawer
          transactionId={editTransactionId || ""}
          onClose={() => setEditTransactionId(null)}
          onUpdate={onRefetch}
        />
      )}
{/* 
      {profileId && (
        <EditProfileDrawer
          userId={editProfileId}
          onClose={() => setEditProfileId(null)}
          onUpdate={onRefetch}
        />
      )} */}

      {/* {userId && (
        <BulkMessageDialog
          isOpen={isMessageDialogOpen}
          onClose={() => setIsMessageDialogOpen(false)}
          userIds={[userId]}
        />
      )} */}

      {/* {fund && (
        <EditFundDrawer
          fundId={editFundId}
          onClose={() => setEditFundId(null)}
          onUpdate={onRefetch}
        />
      )} */}
    </div>
  )
}
