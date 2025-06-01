"use client"

import {
  CommandBar,
  CommandBarBar,
  CommandBarCommand,
  CommandBarSeperator,
  CommandBarValue,
} from "@/components/CommandBar"
import { exportToExcel } from "@/utils/exportToExcel"
import { RowSelectionState, Table } from "@tanstack/react-table"
import { format } from "date-fns"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BulkMessageDialog } from "./BulkMessageDialog"
// import { EditProfileDrawer } from "./EditProfileDrawer"

type DataTableBulkEditorProps<TData> = {
  table: Table<TData>
  rowSelection: RowSelectionState
}

function DataTableBulkEditor<TData>({
  table,
  rowSelection,
}: DataTableBulkEditorProps<TData>) {
  const hasSelectedRows = Object.keys(rowSelection).length > 0
  const selectedRows = Object.keys(rowSelection).map(
    (key) => rowSelection[key],
  ).length
  const pathname = usePathname()
  // const [editProfileId, setEditProfileId] = useState<string | null>(null)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)

  // Отримуємо перший вибраний рядок для редагування
  // const selectedRow = table.getSelectedRowModel().rows[0]?.original as any

  // Передаємо тільки user_id для відправки повідомлень
  const selectedUserIds = table.getSelectedRowModel().rows.map((row) => {
    const data = row.original as any
    return data.user_id
  })

  const handleExportSelected = () => {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original)
    const filename = `${pathname.split("/").pop()?.split("-admin")[0]}_selected_${format(new Date(), "dd.MM.yyyy")}.xlsx`

    exportToExcel({
      data: selectedData as Record<string, any>[],
      columns: table.getAllColumns().map((column) => column.columnDef),
      filename,
    })
  }

  // const handleEdit = () => {
  //   if (selectedRow?.user_id) {
  //     setEditProfileId(selectedRow.user_id)
  //   }
  // }

  // const handleAuth = () => {
  //   if (selectedRow?.user_id) {
  //     window.open(`/overview?view_as_user=${selectedRow.user_id}`, "_blank")
  //   }
  // }

  return (
    <>
      <CommandBar open={hasSelectedRows}>
        <CommandBarBar>
          {selectedRows > 1 && (
            <>
              <CommandBarValue>
                {Object.keys(rowSelection).length} обраних
              </CommandBarValue>
              <CommandBarSeperator />
            </>
          )}
          {/* <CommandBarCommand
            label="Написати"
            action={() => setIsMessageDialogOpen(true)}
            shortcut={{ shortcut: "w" }}
          />
          <CommandBarSeperator /> */}
          {/* {selectedRows === 1 && (
            <>
              <CommandBarCommand
                label="Редагувати профіль"
                action={handleEdit}
                shortcut={{ shortcut: "e" }}
              />
              <CommandBarSeperator />
              <CommandBarCommand
                label="Авторизуватися"
                action={handleAuth}
                shortcut={{ shortcut: "a" }}
              />
              <CommandBarSeperator />
            </>
          )} */}
          <CommandBarCommand
            label="Експортувати"
            action={handleExportSelected}
            shortcut={{ shortcut: "x" }}
          />
          <CommandBarSeperator />
          <CommandBarCommand
            label="Скинути"
            action={() => {
              table.resetRowSelection()
            }}
            shortcut={{ shortcut: "Escape", label: "esc" }}
          />
        </CommandBarBar>
      </CommandBar>

      <BulkMessageDialog
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        userIds={selectedUserIds}
      />

      {/* {editProfileId && (
        <EditProfileDrawer
          userId={editProfileId}
          onClose={() => setEditProfileId(null)}
          onUpdate={table.options.meta?.onRefetch}
        />
      )} */}
    </>
  )
}

export { DataTableBulkEditor }
