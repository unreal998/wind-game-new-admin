"use client"

import { Button } from "@/components/Button"
import { type TableColumn } from "@/types/table"
import { exportToExcel } from "@/utils/exportToExcel"
import { RiDownloadLine } from "@remixicon/react"
import { format } from "date-fns"
import { usePathname } from "next/navigation"

interface ExportButtonProps<TData extends Record<string, any>> {
  data: TData[]
  columns: TableColumn<TData>[]
  filename?: string
}

export function ExportButton<TData extends Record<string, any>>({
  data,
  columns,
  filename,
}: ExportButtonProps<TData>) {
  const pathname = usePathname()

  const handleExport = () => {
    const defaultFilename = `${pathname.split("/").pop()?.split("-admin")[0]}`

    const finalFilename = `${filename || defaultFilename}_${format(new Date(), "dd.MM.yyyy")}.xlsx`

    exportToExcel({
      data,
      columns,
      filename: finalFilename,
    })
  }

  return (
    <Button
      variant="secondary"
      className="flex min-h-[34px] gap-x-2 px-2 py-1.5 text-sm sm:text-xs"
      onClick={handleExport}
    >
      <RiDownloadLine className="size-4 shrink-0" aria-hidden="true" />
      <span className="hidden sm:block">Експорт</span>
    </Button>
  )
}
