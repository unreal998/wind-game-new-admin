"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminUserModsStore } from "@/stores/admin/useAdminUserModsStore"
import { LOCATION_TYPES } from "@/types/location"
import { FilterableColumn } from "@/types/table"
import { useEffect, useState } from "react"
import { userModColumns } from "./_components/UserModColumns"
import { UserMod } from "@/types/userMod"
import { createClient } from "@/utils/supabase/client"
import NotAllowed from "@/components/NotAllowed"
import { roleSelector, useUserStore } from "@/stores/useUserStore"

export default function UserModsAdminPage() {
  const { userMods, isLoading } = useAdminUserModsStore()
  const [aggregatedValue] = useState<string | number | null>(null)
  const formatUserMod = [] as UserMod[];
  const [modifiersData, setModifiers] = useState<any[]>([])
  const userRole = useUserStore(roleSelector)

  useEffect(() => {
    const fetchModsData = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("modifiers").select("*")
      if (error) {
        console.error(`ERROR FETCHING TURX BALANCE: ${error}`)
        return
      }
      setModifiers(data || [])
    }
    fetchModsData()
  }, [])

  userMods.forEach((mod) => {
    const modData = mod as any;
    modData.modifiers.forEach((modifier: any) => {
      if (modifier.boughtModifier.length) {

        const selectedMod = modifiersData.find(
          (m) => m.area === modifier.areaName
        )

        modifier.boughtModifier.forEach((modifierData: any) => {
          const selectedModValue = selectedMod?.values[modifierData.speed - 1];
          const userMod = {
            user: { 
              id: modData.telegramID,
              username: modData.userName || modData.telegramID,
              first_name: modData.firstName || "Unknown",
              last_name: modData.lastName || "Unknown"
            },
            pushes_done: 63 - modifierData.clicksRemaining,
            required_pushes: modifierData.clicksRemaining,
            ton_earned: selectedModValue?.tonValue ? ((selectedModValue.tonValue / 64) * (64 - modifierData.clicksRemaining)).toFixed(2) : 0,
            coins_earned: selectedModValue?.turxValue ? (selectedModValue.turxValue / 64) * (64 - modifierData.clicksRemaining) : 0,
            ton_remaining: selectedModValue?.tonValue ? ((selectedModValue.tonValue / 64) * modifierData.clicksRemaining).toFixed(2) : 0,
            coins_remaining: selectedModValue?.turxValue ? (selectedModValue.turxValue / 64) * modifierData.clicksRemaining : 0,
            price: selectedModValue?.price || 0,
            purchased_at: modifierData.boughtDate,
            location_id: modifier.areaName || "",
          }
          formatUserMod.push(userMod as UserMod);
        })
      }
    })
  })

  const filterableColumns: FilterableColumn[] = [
    {
      id: "user.telegramID",
      title: "Telegram ID користувача",
      type: "text",
    },
    {
      id: "user.username",
      title: "Username",
      type: "text",
    },
    {
      id: "location_id",
      title: "Локація",
      type: "select",
      options: LOCATION_TYPES,
    },
    {
      id: "is_active",
      title: "Статус",
      type: "select",
      options: [
        { value: "true", label: "Активний" },
        { value: "false", label: "Неактивний" },
      ],
    },
    {
      id: "energy_per_hour",
      title: "Енергія за годину",
      type: "number",
    },
    {
      id: "price",
      title: "Ціна",
      type: "number",
    },
    {
      id: "coins_earned",
      title: "Зароблено ENRG",
      type: "number",
    },
    {
      id: "ton_earned",
      title: "Зароблено TON",
      type: "number",
    },
    {
      id: "ton_remaining",
      title: "Залишилось TON",
      type: "number",
    },
    {
      id: "coins_remaining",
      title: "Залишилось кВт",
      type: "number",
    },
    {
      id: "purchased_at",
      title: "Дата покупки",
      type: "dateRange",
    },
  ]

  if (userRole === "marketing") return <NotAllowed />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Моди придбані</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={formatUserMod}
          columns={userModColumns}
          filterableColumns={filterableColumns}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
