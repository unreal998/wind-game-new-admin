"use client"

import { DataTable } from "@/components/data-table/DataTable"
import { FilterableColumn, TableColumn } from "@/types/table"
import { useEffect, useMemo, useState } from "react"
import { getUserData, replenishUserTONBalance, updateUserInvitedBy, updateUserKWTBalance, updateUserReferalArray, updateUserTeam, updateUserTONBalance } from "./updateUserBalance"
import { fetchTransactionsByUid } from "./fetchTransactionsByUid"
import { transactionColumns } from "./transactionColumns"
import { Loader2 } from "lucide-react"
import { areaColumns } from "./areaColumns"
import { modifiersColumns } from "./ModifierColumn"
import { AdminProfile, adminProfileTeams } from "@/types/profile"
import { Select, SelectItem, SelectGroup, SelectValue, SelectTrigger, SelectContent } from "@/components/Select"
import axios from "axios"
import { ReferalsTreeComponent } from "./referalsTreeComponent"

interface UserSidebarProps {
  user: AdminProfile
  onClose: () => void
  onUpdate: (user: any) => void
  isAvialableToWrite: boolean
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
  isAvialableToWrite
}: UserSidebarProps) => {
  const [transactions, setTransactions] = useState<any[] | null>(null)
  const [referalsData, setReferalsData] = useState<any[] | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTransactionsByUid(user.id)
        setTransactions(data)
      } catch (error) {
        console.error("Failed to fetch withdrawals", error)
      }
    }

    if (user?.id) fetchData()
  }, [user?.id])

  const referalsByLevelIncome = useMemo(() => {
    if (!referalsData) return [];
    let usersIncomeByLevel = {
      1: {
        kwtIncome: user?.referalIncomeKWT[1] ?? 0,
        tonIncome: user?.referalIncomeTON[1] ?? 0,
        count: 0,
      },
      2: {
        kwtIncome: user?.referalIncomeKWT[2] ?? 0,
        tonIncome: user?.referalIncomeTON[2] ?? 0,
        count: 0,
      },
      3: {
        kwtIncome: user?.referalIncomeKWT[3] ?? 0,
        tonIncome: user?.referalIncomeTON[3] ?? 0,
        count: 0,
      },
      4: {
        kwtIncome: user?.referalIncomeKWT[4] ?? 0,
        tonIncome: user?.referalIncomeTON[4] ?? 0,
        count: 0,
      },
      5: {
        kwtIncome: user?.referalIncomeKWT[5] ?? 0,
        tonIncome: user?.referalIncomeTON[5] ?? 0,
        count: 0,
      },
    };
    Object.values(referalsData).forEach((userReferal) => {
        usersIncomeByLevel[
          (userReferal.level ?? 1) as keyof typeof usersIncomeByLevel
        ].count += 1;
    });
    return usersIncomeByLevel;
  }, [referalsData, user]);

  useEffect(() => {
    const fetchUserReferalCountData = async (tid: string) => {
      const response = await axios.get(
        `https://turbinextesst.ngrok-free.dev/user/nested-referrals?tid=${tid}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      setReferalsData(response.data.data);
    };
    if (user?.id) fetchUserReferalCountData(user.telegramID)
  }, [user])

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
                  isAvialableToWrite={isAvialableToWrite}
                  onChange={async (val) => {
                    const updated = { ...user, TONBalance: val }
                    await updateUserTONBalance({
                      id: String(user.id),
                      TONBalance: Number(val),
                    })
                    onUpdate(updated)
                  }}
                />
              ),
            },
            {
              label: "кВт",
              value: (
                <EditableBalanceField
                  value={user.WindBalance ?? 0}
                  isAvialableToWrite={isAvialableToWrite}
                  onChange={async (val) => {
                    const updated = { ...user, WindBalance: val }
                    await updateUserKWTBalance({
                      id: String(user.id),
                      WindBalance: Number(val),
                    })
                    onUpdate(updated)
                  }}
                />
              ),
            },
            {
              label: "Пополнить TON",
              value: (
                <EditableBalanceField
                  value={0}
                  isAvialableToWrite={isAvialableToWrite}
                  onChange={async (val) => {
                    await replenishUserTONBalance({
                      wallet: user.wallet as string,
                      amount: Number(val),
                    })
                  }}
                />
              ),
            },
            {
              label: "Команда",
              value: (
                <TeamSelectorField
                  value={user.team as string}
                  isAvialableToWrite={isAvialableToWrite}
                  onChange={async (val) => {
                    const updated = { ...user, team: val }
                    await updateUserTeam({
                      id: String(user.id),
                      team: String(val),
                    })
                    onUpdate(updated)
                  }}
                />
              ),
            },
            {
              label: "Привів користувача",
              value: (
                <EditableBalanceField
                  value={user.invitedBy}
                  isAvialableToWrite={isAvialableToWrite}
                  onChange={async (val) => {
                    try {
                      const invitedByData = await getUserData({
                        id: String(user.invitedBy),
                      })
                      if (invitedByData) {
                        await updateUserReferalArray({
                          id: String(invitedByData.id),
                          referalArray: invitedByData.referals.filter((referal: string) => referal !== String(user.telegramID)),
                        })
                      }
                      const updated = { ...user, invitedBy: String(val) }
                      
                      if (val) {
                        const newOwnerData = await getUserData({
                          id: String(val),
                        })
                        const newReferalsArray = [...(newOwnerData.referals || []), String(user.telegramID)]
                        await updateUserReferalArray({
                          id: String(newOwnerData.id),
                          referalArray: newReferalsArray,
                        })
                      }
                      await updateUserInvitedBy({
                        id: String(user.id),
                        invitedBy: String(val),
                      })

                      onUpdate(updated)
                    } catch (error) {
                      console.error("Failed to update user invited by", error)
                    }
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
              <h4 className="text-lg font-semibold mb-2">Виведення коштів</h4>
              <div className="flex items-center justify-between gap-4 border-b pb-1">
                <h4 className="text-sm font-semibold">Підтверджено: {tableData?.filter((transaction: any) => transaction.status === "completed").reduce((acc: number, curr: any) => acc + curr.sum, 0)}</h4>
                <h4 className="text-sm font-semibold">Відмінено: {tableData?.filter((transaction: any) => transaction.status === "declined").reduce((acc: number, curr: any) => acc + curr.sum, 0)}</h4>
                <h4 className="text-sm font-semibold">В очікуванні: {tableData?.filter((transaction: any) => transaction.status === "new").reduce((acc: number, curr: any) => acc + curr.sum, 0)}</h4>
                <h4 className="text-sm font-semibold">Загальна сума: {tableData?.reduce((acc: number, curr: any) => acc + curr.sum, 0)}</h4>
              </div>
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
              <div className="flex items-center justify-between gap-4 border-b pb-1">
                <h4 className="text-sm font-semibold">Загальна сума: {Math.floor((transactions?.reduce((acc: number, curr: any) => acc + curr.summ, 0) ?? 0) * 10000) / 10000}</h4>
              </div>
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
          {referalsByLevelIncome && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Рефералів по рівнях</h3>
              <div className="max-h-[400px] overflow-auto rounded border dark:border-gray-700">
                {Object.entries(referalsByLevelIncome).map(([level, data]) => (
                  <div key={level} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
                    <h5 style={{ fontSize: "16px" }} className="text-lg font-semibold">Рівень {level}</h5>
                    <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>                    
                      <p style={{ fontSize: "14px" }}>Кількість рефералів: {data.count}</p>
                      <p style={{ fontSize: "14px" }}>кВт: {Math.floor((data.kwtIncome) * 10000) / 10000}</p>
                      <p style={{ fontSize: "14px" }}>TON: {Math.floor((data.tonIncome) * 10000) / 10000}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {
            <div>
              <h3 className="mb-2 text-lg font-semibold">Дерево рефералів</h3>
              <ReferalsTreeComponent uid={user.telegramID} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

const EditableBalanceField = ({
  value,
  onChange,
  isAvialableToWrite
}: {
  value: number | string
  onChange: (val: number | string) => Promise<void>
  isAvialableToWrite: boolean
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
        type={typeof value === "number" ? "number" : "text"}
        className="flex-grow rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-transparent dark:text-white"
        value={input}
        onChange={(e) => typeof value === "number" ? setInput(parseFloat(e.target.value)) : setInput(e.target.value)}
        disabled={isLoading}
      />
      {isAvialableToWrite && <button
        onClick={handleSave}
        disabled={isLoading}
        className="ml-auto flex items-center justify-center rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        style={{ minWidth: "84px" }}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Зберегти"}
      </button>}
    </div>
  )
}

const TeamSelectorField = ({
  value,
  onChange,
  isAvialableToWrite
}: {
  value: string
  onChange: (val: string) => Promise<void>
  isAvialableToWrite: boolean
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
      <Select
        onValueChange={async (value) => {
          setInput(value);
        }}
        value={input}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {adminProfileTeams.map((team) => (
              <SelectItem key={team} value={team}>
                {team.toUpperCase()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isAvialableToWrite && <button
        onClick={handleSave}
        disabled={isLoading}
        className="ml-auto flex items-center justify-center rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        style={{ minWidth: "84px" }}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Зберегти"}
      </button>}
    </div>
  )
}