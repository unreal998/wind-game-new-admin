"use client"

import { Checkbox } from "@/components/Checkbox"
import { CopyButton } from "@/components/CopyButton"
import { type AdminProfile } from "@/types/profile"
import { type TableColumn } from "@/types/table"
import { formatAmount } from "@/utils/amountFormatter"
import { Database } from "@/utils/supabase/database.types"
import { createColumnHelper } from "@tanstack/react-table"

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
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(e) => e.stopPropagation()}
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

  columnHelper.accessor("telegramID", {
    header: "Telegram ID",
    cell: ({ getValue }) => {
      const id = getValue()
      if (!id) return "-"
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
      exportValue: (row) => row.telegramID || "-",
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

  columnHelper.accessor("TONBalance", {
    header: "TON Баланс",
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
    header: "Wind Баланс",
    cell: ({ getValue }) => formatAmount(getValue()),
    enableSorting: true,
    filterFn: "number",
    meta: {
      exportHeader: "kw Balance",
      exportValue: (row) => row.WindBalance || 0,
      exportAlign: "right",
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
    header: "Фамілія",
    cell: ({ getValue }) => getValue() || "-",
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.lastName || "-",
    },
  }),
  columnHelper.accessor("invitedBy", {
    header: "Запросив",
    cell: ({ getValue }) => {
      const invitedBy = getValue()
      if (!invitedBy) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{invitedBy}</span>
          <CopyButton text={invitedBy} />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.invitedBy || "-",
    },
  }),
  columnHelper.accessor("telegramID", {
    header: "Посилання для запрошення",
    cell: ({ getValue }) => {
      const invitedBy = getValue()
      if (!invitedBy) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{`https://t.me/WindGameAppWrapperBot?start=r_${invitedBy}`}</span>
          <CopyButton
            text={`https://t.me/WindGameAppWrapperBot?start=r_${invitedBy}`}
          />
        </span>
      )
    },
    enableSorting: true,
    filterFn: "text",
    meta: {
      exportValue: (row) => row.invitedBy || "-",
    },
  }),
  columnHelper.accessor("areas", {
    header: "Області",
    cell: ({ getValue }) => {
      let areaString: string = ""
      const areas: Database["public"]["Tables"]["users"]["Row"]["areas"] =
        getValue()
      for (const area of areas) {
        areaString += `name:${area.name}\n bought:${area.bought}\n available:${area.available}\n lastButtonPress${area.lastButtonPress}\n nextButtonPress${area.nextButtonPress}`
      }

      if (!areas) return "-"

      return (
        <span className="flex items-center space-x-2">
          <span className="max-w-[150px] truncate">{areaString}</span>
          <CopyButton text={areaString} />
        </span>
      )
    },
  }),
  columnHelper.accessor("wallet", {
    header: "Гаманець",
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
]
