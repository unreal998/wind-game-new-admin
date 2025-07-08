import { useState } from "react"
import { X } from "lucide-react"
import {
  fetchCreatePermission,
  CreatePermissionDto,
  AdminPermissions,
} from "./permissionsApi"
import { cx } from "@/lib/utils"
import { Button, Input } from "@/components"

export const CreatePermissionModal = ({
  onClose,
  setNewPermission,
}: {
  onClose: () => void
  setNewPermission: (permission: any) => void
}) => {
  const [form, setForm] = useState<CreatePermissionDto>({
    email: "",
    type: "admin",
    permissions: ["read"],
  })
  const [name, setName] = useState("")

  const handleChange = (field: keyof CreatePermissionDto, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePermissionChange = (perm: AdminPermissions) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(perm)
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm],
      }
    })
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Вкажіть ім'я")
      return
    }
    if (!form.email.trim()) {
      alert("Вкажіть email")
      return
    }
    try {
      const result = await fetchCreatePermission(form)
      setForm({
        email: "",
        type: "admin",
        permissions: ["read"],
      })
      setName("")
      onClose()
      setNewPermission({
        ...form,
        name,
        created_at: new Date().toISOString(),
        ...result,
      })
    } catch (error) {
      alert("Помилка при створенні користувача")
    }
  }

  return (
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
            Створити Permission
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
            type="text"
            placeholder="Ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <select
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className={cx(
              "w-full",
              "relative block appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
              "border-gray-300 dark:border-gray-800",
              "text-gray-900 dark:text-gray-50",
              "bg-white dark:bg-gray-950",
            )}
          >
            <option value="admin">Admin</option>
            <option value="teamlead">Teamlead</option>
            <option value="guest">Guest</option>
          </select>
          <div>
            <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Дозволи:
            </div>
            <div className="flex gap-4">
              {(["read", "write"] as AdminPermissions[]).map((perm) => (
                <label key={perm} className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(perm)}
                    onChange={() => handlePermissionChange(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Створити
          </Button>
        </div>
      </div>
    </div>
  )
}
