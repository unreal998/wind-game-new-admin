import { useState } from "react"
import { X } from "lucide-react"
import { cx } from "@/lib/utils"
import { Button, Input } from "@/components"
import {
  AdminPermissions,
  CreatePermissionDto,
  useAdminPermissionsStore,
} from "@/stores/admin/useAdminPermissionsStore"
import { SignUpDto, useAuthStore } from "@/stores/useAuthStore"

export const CreatePermissionModal = ({ onClose }: { onClose: () => void }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [form, setForm] = useState<CreatePermissionDto & SignUpDto>({
    email: "",
    password: "",
    type: "admin",
    permissions: ["read"],
    options: {
      data: {
        first_name: "",
        last_name: "",
        phone: "",
      },
    },
  })
  const { createPermission } = useAdminPermissionsStore()
  const { createNewUser } = useAuthStore()

  const handleChange = (field: keyof (CreatePermissionDto & SignUpDto), value: any) => {
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
    if (!form.email.trim()) {
      alert("Вкажіть email")
      return
    }
    if (!form.password.trim()) {
      alert("Вкажіть пароль")
      return
    }
    try {
      const result = await createNewUser({
        email: form.email,
        password: form.password,
        options: form.options,
      })

      if (result.error) {
        alert("Помилка при створенні користувача: " + result.error)
        return
      }

      const additionalField = form.options?.data?.additionalField || ""
      const match = additionalField.match(/r_(\d+)/);
      const extractedId = match ? match[1] : additionalField; 

      await createPermission({
        email: form.email,
        type: form.type,
        permissions: form.permissions,
        additionalField: extractedId,
      })
      setForm({
        email: "",
        password: "",
        type: "admin",
        permissions: ["read"],
        options: {
          data: {
            first_name: "",
            last_name: "",
            phone: "",
            additionalField: ""
          },
        },
      })
      onClose()
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
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <select
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className={cx(
              "w-full",
              "relative block appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
              "border-gray-300 dark:border-gray-800",
              "text-gray-900 dark:text-gray-50",
              "bg-white dark:bg-gray-950"
            )}
          >
            <option value="admin">Admin</option>
            <option value="teamlead">Teamlead</option>
            <option value="marketing">Marketing</option>
            <option value="guest">Guest</option>
          </select>
          { form.type === 'marketing' &&  <Input
                required={true}
                type="text"
                placeholder="tid юзера"
                value={form.options?.data?.additionalField || ""}
                onChange={(e) =>
                  handleChange("options", {
                    ...form.options,
                    data: {
                      ...form.options?.data,
                      additionalField: e.target.value,
                    }
                  })
                }
              />
            }
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

          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={(e) => setShowAdvanced(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <span>Увімкнути необов&apos;язкові параметри</span>
          </label>
          {showAdvanced && (
            <div className="mt-4 space-y-2">
              <Input
                type="text"
                placeholder="Ім'я користувача"
                value={form.options?.data?.first_name || ""}
                onChange={(e) =>
                  handleChange("options", {
                    ...form.options,
                    data: {
                      ...form.options?.data,
                      first_name: e.target.value,
                    }
                  })
                }
              />
              <Input
                type="text"
                placeholder="Прізвище користувача"
                value={form.options?.data?.last_name || ""}
                onChange={(e) =>
                  handleChange("options", {
                    ...form.options,
                    data: {
                      ...form.options?.data,
                      last_name: e.target.value,
                    }
                  })
                }
              />
              <Input
                type="text"
                placeholder="Телефон"
                value={form.options?.data?.phone || ""}
                onChange={(e) =>
                  handleChange("options", {
                    ...form.options,
                    data: {
                      ...form.options?.data,
                      phone: e.target.value,
                    }
                  })
                }
              />
            </div>
          )}

          <Button className="w-full" onClick={handleSubmit}>
            Створити
          </Button>
        </div>
      </div>
    </div>
  )
}
