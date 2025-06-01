"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import {
  BOOLEAN_OPTIONS,
  CHAT_TYPES,
  PLATFORMS,
} from "@/components/data-table/constants"
import { DataTable } from "@/components/data-table/DataTable"
import { useAdminReferralsStore } from "@/stores/admin/useAdminReferralsStore"
import { FilterableColumn } from "@/types/table"
import { useState } from "react"
import { userColumns } from "./_components/UserColumns"

export default function ReferralsAdminPage() {
  const { profiles, isLoading } = useAdminReferralsStore()
  const [aggregatedValue, setAggregatedValue] = useState<
    string | number | null
  >(null)

  const filterableColumns: FilterableColumn[] = [
    {
      id: "id",
      title: "ID",
      type: "text",
    },
    {
      id: "name",
      title: "Ім'я",
      type: "text",
    },
    {
      id: "username",
      title: "Username",
      type: "text",
    },
    {
      id: "language_code",
      title: "Мова",
      type: "text",
    },
    {
      id: "is_premium",
      title: "Premium",
      type: "boolean",
      options: BOOLEAN_OPTIONS,
    },
    {
      id: "is_bot",
      title: "Бот",
      type: "boolean",
      options: BOOLEAN_OPTIONS,
    },
    {
      id: "allows_write_to_pm",
      title: "Повідомлення",
      type: "boolean",
      options: BOOLEAN_OPTIONS,
    },
    {
      id: "added_to_attachment_menu",
      title: "Закріплено",
      type: "boolean",
      options: BOOLEAN_OPTIONS,
    },
    {
      id: "platform",
      title: "Платформа",
      type: "select",
      options: PLATFORMS,
    },
    {
      id: "version",
      title: "Версія",
      type: "text",
    },
    {
      id: "created_at",
      title: "Реєстрація",
      type: "dateRange",
    },
    // {
    //   id: "auth_date",
    //   title: "Авторизація",
    //   type: "dateRange",
    // },
    {
      id: "start_param",
      title: "Параметр запуску",
      type: "text",
    },
    {
      id: "referrer_id",
      title: "Запросив",
      type: "text",
    },
    {
      id: "referral_code",
      title: "Код запрошення",
      type: "text",
    },
    // {
    //   id: "query_id",
    //   title: "Query ID",
    //   type: "text",
    // },
    {
      id: "chat_type",
      title: "Джерело переходу",
      type: "select",
      options: CHAT_TYPES,
    },
    {
      id: "chat_instance",
      title: "ID джерела",
      type: "text",
    },
    {
      id: "ton_balance",
      title: "TON баланс",
      type: "number",
    },
    {
      id: "coin_balance",
      title: "ENRG баланс",
      type: "number",
    },
    {
      id: "wallet",
      title: "Гаманець користувача",
      type: "text",
    },
    {
      id: "wallet_ton",
      title: "Гаманець поповнення",
      type: "text",
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Користувачі</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-0">
        <DataTable
          data={profiles}
          columns={userColumns}
          filterableColumns={filterableColumns}
          aggregations={[
            {
              columnId: "ton_balance",
              type: "sum",
              onResult: setAggregatedValue,
            },
          ]}
          isLoading={isLoading}
        />
      </Card>
    </>
  )
}
