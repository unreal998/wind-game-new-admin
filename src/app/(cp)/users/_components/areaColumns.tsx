import { CopyButton } from "@/components/CopyButton"
import { TableColumn } from "@/types/table"
import { Database } from "@/utils/supabase/database.types"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper =
  createColumnHelper<Database["public"]["ComplicatedTypes"]["Area"]>()

export const areaColumns: TableColumn<
  Database["public"]["ComplicatedTypes"]["Area"]
>[] = [
    columnHelper.accessor("name", {
      header: "Ім'я",
      cell: ({ getValue }) => {
        const name = getValue()
        if (!name) return "-"

        return (
          <span className="flex items-center space-x-2">
            <span className="font-medium"> {name} </span>
            <CopyButton text={name} />
          </span>
        )
      },
    }),
    columnHelper.accessor("bought", {
      header: "Куплено",
      cell: ({ getValue }) => {
        const bought = getValue()
        return (
          <span className="flex items-center space-x-2">
            <span className="font-medium"> {bought ? "Так" : "Ні"} </span>
            <CopyButton text={bought ? "Так" : "Ні"} />
          </span>
        )
      },
    }),
    columnHelper.accessor("available", {
      header: "Доступний",
      cell: ({ getValue }) => {
        const available = getValue()
        return (
          <span className="flex items-center space-x-2">
            <span className="font-medium"> {available ? "Так" : "Ні"} </span>
            <CopyButton text={available ? "Так" : "Ні"} />
          </span>
        )
      },
    }),
    columnHelper.accessor("lastButtonPress", {
      header: "Останнє Натискання Павер Кнопки",
      cell: ({ getValue }) => {
        const lastButtonPress = getValue()
        if (!lastButtonPress) return "-"

        return (
          <span className="flex items-center space-x-2">
            <span className="font-medium">
              {" "}
              {new Date(lastButtonPress).toLocaleString()}
            </span>
            <CopyButton text={lastButtonPress} />
          </span>
        )
      },
    }),
    columnHelper.accessor("nextButtonPress", {
      header: "Наступне Натискання Павер Кнопки",
      cell: ({ getValue }) => {
        const nextButtonPress = getValue()
        if (!nextButtonPress) return "-"

        return (
          <span className="flex items-center space-x-2">
            <span className="font-medium">
              {" "}
              {new Date(nextButtonPress).toLocaleString()}
            </span>
            <CopyButton text={nextButtonPress} />
          </span>
        )
      },
    }),
  ]
