import { CopyButton } from "@/components/CopyButton"
import { TableColumn } from "@/types/table"
import { Database } from "@/utils/supabase/database.types"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper =
  createColumnHelper<Database["public"]["ComplicatedTypes"]["Modifiers"]>()

export const modifiersColumns: TableColumn<
  Database["public"]["ComplicatedTypes"]["Modifiers"]
>[] = [
  columnHelper.accessor("areaName", {
    header: "Назва Області",
    cell: ({ getValue }) => {
      const areaName = getValue()
      if (!areaName) return "-"
      return (
        <span className="flex items-center space-x-2">
          <span className="font-medium">{areaName}</span>
          <CopyButton text={areaName} />
        </span>
      )
    },
  }),
  columnHelper.accessor("boughtModifier", {
    header: "Куплені модифікатори",
    cell: ({ getValue }) => {
      const boughtModifier: Database["public"]["ComplicatedTypes"]["Modifiers"]["boughtModifier"] =
        getValue()

      if (boughtModifier.length === 0) return "-"
      return (
        <div>
          {boughtModifier.map((modifier, index) => (
            <span key={index} className="flex flex-col items-center p-1">
              <span className="font-medium">Швидкість: {modifier.speed}</span>
              <span className="font-medium">
                Дата покупки: {new Date(modifier.boughtDate).toLocaleString()}
              </span>
              <span className="font-medium">
                Залишилося кликів: {modifier.clicksRemaining}
              </span>
            </span>
          ))}
        </div>
      )
    },
  }),
]
