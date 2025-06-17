import { CopyButton } from "@/components/CopyButton"
import { DateWithDistance } from "@/components/data-table/DateWithDistance"
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
    header: "Куплені модіфаери",
    cell: ({ getValue }) => {
      const boughtModifier: Database["public"]["ComplicatedTypes"]["Modifiers"]["boughtModifier"] =
        getValue()

      if (!boughtModifier) return "-"
      return (
        <div>
          {boughtModifier.map((modifier) => (
            <span className="flex flex-col items-center p-1">
              <span className="font-medium">Швидкість{modifier.speed}</span>
              <span className="font-medium">
                Дата покупки
                <DateWithDistance
                  date={new Date(modifier.boughtDate).toISOString()}
                />
              </span>
              <span className="font-medium">
                Залишилося кликів{modifier.clicksRemaining}
              </span>
            </span>
          ))}
        </div>
      )
    },
  }),
]
