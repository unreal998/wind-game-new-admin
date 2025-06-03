"use client"

import { Badge } from "@/components/Badge"
import { Checkbox } from "@/components/Checkbox"
import { CopyButton } from "@/components/CopyButton"
import {
  BOOLEAN_OPTIONS,
  LANGUAGE_TO_COUNTRY,
  PLATFORMS,
} from "@/components/data-table/constants"
// import { DataTableRowActions } from "@/components/data-table/DataTableRowActions"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { type AdminProfile } from "@/types/profile"
import { type TableColumn } from "@/types/table"
import { formatAmount } from "@/utils/amountFormatter"
import { createColumnHelper } from "@tanstack/react-table"
import { FlagImage } from "react-international-phone"

const columnHelper = createColumnHelper<AdminProfile>()

export const userColumns: TableColumn<AdminProfile>[] = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),

  columnHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => {
      const id = getValue()
      return (
        <span className="flex items-center space-x-2">
          <span className="font-medium">{id}</span>
          <CopyButton text={String(id)} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => String(row.id),
    },
  }),

  columnHelper.accessor("userName", {
    header: "Username",
    cell: ({ getValue }) => {
      const username = getValue()
      if (!username) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span>{username}</span>
          <CopyButton text={username} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.userName || "-",
    },
  }),

  columnHelper.accessor("firstName", {
    header: "Ім'я",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.firstName || "-",
    },
  }),

  columnHelper.accessor("lastName", {
    header: "Прізвище",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.lastName || "-",
    },
  }),

  columnHelper.accessor("language", {
    header: "Мова",
    cell: ({ getValue }) => {
      const langCode = getValue()
      if (!langCode) return "-"

      // Конвертуємо код мови в код країни
      const countryCode =
        LANGUAGE_TO_COUNTRY[langCode.toLowerCase()] || langCode.toLowerCase()

      return (
        <span className="flex items-center space-x-1">
          <FlagImage iso2={countryCode} size="16px" />
          <span>{langCode.toUpperCase()}</span>
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.language?.toUpperCase() || "-",
    },
  }),

  columnHelper.accessor("is_premium", {
    header: "Premium",
    cell: ({ getValue }) => {
      const isPremium = getValue()
      return (
        <Badge variant={isPremium ? "success" : "neutral"}>
          {BOOLEAN_OPTIONS.find((opt) => opt.value === String(isPremium))
            ?.label || "Ні"}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: "boolean",
    meta: {
      exportValue: (row) =>
        BOOLEAN_OPTIONS.find((opt) => opt.value === String(row.is_premium))
          ?.label || "Ні",
    },
  }),

  columnHelper.accessor("is_bot", {
    header: "Бот",
    cell: ({ getValue }) => {
      const isBot = getValue()
      return (
        <Badge variant={isBot ? "error" : "neutral"}>
          {BOOLEAN_OPTIONS.find((opt) => opt.value === String(isBot))?.label ||
            "Ні"}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: "boolean",
    meta: {
      exportValue: (row) =>
        BOOLEAN_OPTIONS.find((opt) => opt.value === String(row.is_bot))
          ?.label || "Ні",
    },
  }),

  columnHelper.accessor("allows_write_to_pm", {
    header: "Повідомлення",
    cell: ({ getValue }) => {
      const allowsPM = getValue()
      return (
        <Badge variant={allowsPM ? "success" : "error"}>
          {allowsPM ? "Так" : "Ні"}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: "boolean",
    meta: {
      exportValue: (row) => (row.allows_write_to_pm ? "Так" : "Ні"),
    },
  }),

  columnHelper.accessor("added_to_attachment_menu", {
    header: "Закріплено",
    cell: ({ getValue }) => {
      const inMenu = getValue()
      return (
        <Badge variant={inMenu ? "success" : "neutral"}>
          {inMenu ? "Так" : "Ні"}
        </Badge>
      )
    },
    enableSorting: true,
    filterFn: "boolean",
    meta: {
      exportValue: (row) => (row.added_to_attachment_menu ? "Так" : "Ні"),
    },
  }),

  columnHelper.accessor("platform", {
    header: "Платформа",
    cell: ({ getValue }) => {
      const platform = getValue()
      return PLATFORMS.find((p) => p.value === platform)?.label || "-"
    },
    enableSorting: true,
    filterFn: "select",
    meta: {
      exportValue: (row) =>
        PLATFORMS.find((p) => p.value === row.platform)?.label || "-",
    },
  }),

  columnHelper.accessor("version", {
    header: "Версія",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.version || "-",
    },
  }),

  // columnHelper.accessor("status", {
  //   header: "Статус",
  //   cell: ({ getValue }) => {
  //     const status = getValue()
  //     if (!status) return "-"
  //     const statusOption = USER_STATUSES.find((s) => s.value === status)
  //     return (
  //       <Badge
  //         variant={
  //           status === "active"
  //             ? "success"
  //             : status === "banned"
  //               ? "error"
  //               : "neutral"
  //         }
  //       >
  //         {statusOption?.label}
  //       </Badge>
  //     )
  //   },
  //   enableSorting: true,
  //   filterFn: "select",
  //   meta: {
  //     exportValue: (row) =>
  //       USER_STATUSES.find((s) => s.value === row.status)?.label || "-",
  //   },
  // }),

  columnHelper.accessor("created_at", {
    header: "Реєстрація",
    cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
    enableSorting: true,
    filterFn: "dateRange",
    meta: {
      exportValue: (row) =>
        row.created_at ? formatTimestamp({ date: row.created_at }) : "-",
    },
  }),

  // columnHelper.accessor("auth_date", {
  //   header: "Авторизація",
  //   cell: ({ getValue }) => <DateWithDistance date={getValue()} />,
  //   enableSorting: true,
  //   filterFn: "dateRange",
  //   meta: {
  //     exportValue: (row) =>
  //       row.auth_date ? formatTimestamp({ date: row.auth_date }) : "-",
  //   },
  // }),

  columnHelper.accessor("start_param", {
    header: "Параметр запуску",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.start_param || "-",
    },
  }),

  columnHelper.accessor("referrer_id", {
    header: "Запросив",
    cell: ({ getValue }) => {
      const id = getValue()
      if (!id) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="font-medium">ID: {id}</span>
          <CopyButton text={String(id)} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => (row.referrer_id ? `ID: ${row.referrer_id}` : "-"),
    },
  }),

  columnHelper.accessor("referral_code", {
    header: "Код запрошення",
    cell: ({ getValue }) => {
      const code = getValue()
      if (!code) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span>{code}</span>
          <CopyButton text={code} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.referral_code || "-",
    },
  }),

  // columnHelper.accessor("query_id", {
  //   header: "Query ID",
  //   cell: ({ getValue }) => getValue() || "-",
  //   enableSorting: true,
  //   filterFn: "text",
  //   meta: {
  //     exportValue: (row) => row.query_id || "-",
  //   },
  // }),

  columnHelper.accessor("TONBalance", {
    header: "TON баланс",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "TON баланс",
      exportValue: (row) => row.TONBalance || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("WindBalance", {
    header: "ENRG баланс",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "ENRG баланс",
      exportValue: (row) => row.WindBalance || 0,
      exportAlign: "right",
    },
  }),

  columnHelper.accessor("wallet", {
    header: "Гаманець користувача",
    cell: ({ getValue }) => {
      const wallet = getValue()
      if (!wallet) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{wallet}</span>
          <CopyButton text={wallet} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.wallet || "-",
    },
  }),

  columnHelper.accessor("wallet_ton", {
    header: "Гаманець поповнення",
    cell: ({ getValue }) => {
      const wallet = getValue()
      if (!wallet) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{wallet}</span>
          <CopyButton text={wallet} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.wallet_ton || "-",
    },
  }),

  // columnHelper.display({
  //   id: "actions",
  //   header: "",
  //   enableSorting: false,
  //   enableHiding: false,
  //   cell: ({ row, table }) => (
  //     <DataTableRowActions
  //       // userId={row.original.id}
  //       onRefetch={table.options.meta?.onRefetch}
  //     />
  //   ),
  // }),
]
