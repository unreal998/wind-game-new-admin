"use client"

import { updateUserByEmail } from "@/actions/users"
import { Button, Input } from "@/components"
import {
  AdminPermissions,
  GetPermissionsDto,
  UpdatePermissionDto,
  useAdminPermissionsStore,
} from "@/stores/admin/useAdminPermissionsStore"
import { X } from "lucide-react"
import React, { useState } from "react"

export default function PermissionsActions({
  permission,
}: {
  permission: GetPermissionsDto
}) {
  const [open, setOpen] = useState<boolean>(false)
  const { updatePermission, deletePermission, fetchPermissions } =
    useAdminPermissionsStore()
  const [form, setForm] = useState<
    UpdatePermissionDto & { password: string; }
  >({
    email: permission.email,
    type: permission.type,
    permissions: permission.permissions,
    password: "",
  })

  const onClose = () => {
    setOpen(false)
  }

  const handleChange = (
    field: keyof (UpdatePermissionDto & { password?: string; }),
    value: string | string[],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePermissionsChange = (permission: AdminPermissions) => {
    setForm((prev) => {
      const newPermissions = prev.permissions?.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...(prev.permissions || []), permission]
      return {
        ...prev,
        permissions: newPermissions,
      }
    })
  }

  const handleSubmit = async () => {
    const result = await updateUserByEmail(permission.email, form)
    if (result.error) {
      alert("Помилка при створенні користувача: " + result.error)
      return
    }

    await updatePermission(permission.id, {
      email: form.email,
      type: form.type,
      permissions: form.permissions,
    })
    onClose()
  }

  const handleRemove = async () => {
    await deletePermission(permission.id)
    await fetchPermissions()
    onClose()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Редагувати</Button>
      <Button
        style={{
          marginLeft: "8px",
        }}
        onClick={handleRemove}
      >
        Видалити
      </Button>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-gray-950"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="w-full text-center text-2xl font-bold text-gray-900 dark:text-white">
                Редагувати Дозволи
              </h2>
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <Input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />

              <select
                value={form.type}
                onChange={(e) =>
                  handleChange(
                    "type",
                    e.target.value as GetPermissionsDto["type"],
                  )
                }
                className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-gray-900 shadow-sm outline-none transition sm:text-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
              >
                <option value="admin">Адмін</option>
                <option value="teamlead">Тімлід</option>
                <option value="guest">Гість</option>
              </select>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Permissions</h3>
                <div className="flex items-center space-x-4">
                  {(["read", "write"] as AdminPermissions[]).map((p) => (
                    <label key={p} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.permissions?.includes(p)}
                        onChange={() => handlePermissionsChange(p)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={handleSubmit}>
                Оновити
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
