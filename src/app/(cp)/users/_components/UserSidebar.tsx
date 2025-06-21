"use client"

import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn, TableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { updateUserKWTBalance, updateUserTONBalance } from "./updateUserBalance"
import { fetchTransactionsByUid } from "./fetchTransactionsByUid"
import { transactionColumns } from "./transactionColumns"
import { Loader2 } from "lucide-react"
import { Database } from "@/utils/supabase/database.types"
import { areaColumns } from "./areaColumns"
import { modifiersColumns } from "./ModifierColumn"

interface UserSidebarProps {
  user: Database["public"]["Tables"]["users"]["Row"]
  onClose: () => void
  onUpdate: (user: any) => void
  tableData?: any
  tableColumns?: TableColumn<any>[]
  filterableColumns?: FilterableColumn[]
}

export const UserSidebar = ({
  user,
  onClose,
  onUpdate,
  tableData,
  tableColumns,
}: UserSidebarProps) => {
  const [transactions, setTransactions] = useState<any[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("USER", user)
        const data = await fetchTransactionsByUid(user.id)
        setTransactions(data)
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }

    if (user?.id) fetchData()
  }, [user?.id])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-slide-in flex h-full w-[50%] flex-col bg-white shadow-xl dark:bg-[#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Деталі користувача</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {[
            { label: "ID", value: user.id },
            { label: "Telegram ID", value: user.telegramID },
            { label: "Username", value: user.userName || "—" },
            {
              label: "Туторіал завершено",
              value: user.userSettings?.isTutorialFinished ? "Yes" : "No",
            },
            {
              label: "Рефералів",
              value: user.referals?.length || 0,
            },
            {
              label: "TON Баланс",
              value: (
                <EditableBalanceField
                  value={user.TONBalance ?? 0}
                  onChange={async (val) => {
                    const updated = { ...user, TONBalance: val }
                    await updateUserTONBalance({
                      id: String(user.id),
                      TONBalance: updated.TONBalance,
                    })
                    onUpdate(updated)
                  }}
                />
              ),
            },
            {
              label: "kwt",
              value: (
                <EditableBalanceField
                  value={user.WindBalance ?? 0}
                  onChange={async (val) => {
                    const updated = { ...user, WindBalance: val }
                    await updateUserKWTBalance({
                      id: String(user.id),
                      WindBalance: updated.WindBalance,
                    })
                    onUpdate(updated)
                  }}
                />
              ),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 border-b pb-1"
            >
              <span className="font-medium">{label}</span>
              <span className="text-right">{value}</span>
            </div>
          ))}
          {tableData && tableColumns && (
            <div className="pt-6">
              <h3 className="mb-2 text-lg font-semibold">Виведення коштів</h3>
              <div className="max-h-[300px] overflow-auto rounded border dark:border-gray-700">
                <DataTable
                  data={tableData}
                  columns={tableColumns}
                  filterableColumns={[]}
                  onRowClick={() => {}}
                  openSidebarOnRowClick={false}
                />
              </div>
            </div>
          )}
          {transactions && (
            <div className="pt-6">
              <h3 className="mb-2 text-lg font-semibold">Транзакції</h3>
              <div className="max-h-[400px] overflow-auto rounded border dark:border-gray-700">
                <DataTable
                  data={transactions}
                  columns={transactionColumns}
                  onRowClick={() => {}}
                  openSidebarOnRowClick={false}
                />
              </div>
            </div>
          )}
          {user.areas && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Області</h3>
              <div className="max-h-[400px] overflow-auto rounded border dark:border-gray-700">
                <DataTable
                  data={user.areas}
                  columns={areaColumns}
                  onRowClick={() => {}}
                  openSidebarOnRowClick={false}
                />
              </div>
            </div>
          )}
          {user.modifiers && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Модифікатори</h3>
              <div className="max-h-[400px] overflow-auto rounded border dark:border-gray-700">
                <DataTable
                  data={user.modifiers}
                  columns={modifiersColumns}
                  onRowClick={() => {}}
                  openSidebarOnRowClick={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const EditableBalanceField = ({
  value,
  onChange,
}: {
  value: number
  onChange: (val: number) => Promise<void>
}) => {
  const [input, setInput] = useState(value)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onChange(input)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setInput(value)
  }, [value])

  return (
    <div className="flex w-full items-center gap-2">
      <input
        type="number"
        className="flex-grow rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-transparent dark:text-white"
        value={input}
        onChange={(e) => setInput(parseFloat(e.target.value))}
        disabled={isLoading}
      />
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="ml-auto flex items-center justify-center rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        style={{ minWidth: "84px" }}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Зберегти"}
      </button>
    </div>
  )
}
