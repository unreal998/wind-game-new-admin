"use client"

import { Button } from "@/components/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { AdminRoles } from "@/types/config"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const supabase = createClient()

const roles: { value: AdminRoles; label: string }[] = [
  { value: "admin", label: "Адміністратор" },
  { value: 'marketing', label: "Маркетинг"},
  { value: "teamlead", label: "Тім лід" },
  { value: "guest", label: "Гість" },
]

interface User {
  id: string
  email: string
  user_metadata: {
    first_name?: string
    last_name?: string
    phone?: string
  }
}

interface ModalAddUserProps {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

function searchUser(user: User, searchTerm: string): boolean {
  if (!searchTerm) return true

  const searchTerms = searchTerm.toLowerCase().split(" ")
  const searchFields = [
    user.email,
    user.user_metadata.first_name,
    user.user_metadata.last_name,
    user.id,
    user.user_metadata.phone,
  ].map((field) => field?.toLowerCase() || "")

  return searchTerms.every((term) =>
    searchFields.some((field) => field.includes(term)),
  )
}

export function ModalAddUser({ children, onOpenChange }: ModalAddUserProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<AdminRoles | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_profiles_view")
        .select("*")
        .is("role", null)

      if (error) throw error

      const formattedUsers: User[] = data.map((user) => ({
        id: user.user_id,
        email: user.email,
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
        },
      }))

      setUsers(formattedUsers)
      setFilteredUsers(formattedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Помилка при отриманні списку рефералів")
    }
  }

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  useEffect(() => {
    setFilteredUsers(users.filter((user) => searchUser(user, search)))
  }, [search, users])

  const handleSubmit = async () => {
    if (!selectedUser || !selectedRole) return

    setIsLoading(true)
    try {
      const { error } = await supabase.rpc("add_admin_role", {
        user_id: selectedUser.id,
        role: selectedRole,
      })

      if (error) throw error

      toast.success("Адміністратора успішно додано")
      onOpenChange?.(false)
    } catch (error) {
      console.error("Error adding admin:", error)
      toast.error("Помилка при додаванні адміністратора")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) {
          setSelectedUser(null)
          setSelectedRole(null)
          setSearch("")
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Додати адміністратора</DialogTitle>
          <DialogDescription className="text-sm">
            Оберіть користувача та призначте йому роль доступу
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="relative">
              <Select
                onValueChange={(value) => {
                  const user = users.find((u) => u.id === value)
                  setSelectedUser(user || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть користувача" />
                </SelectTrigger>
                <SelectContent className="max-w-full">
                  <div className="sticky top-0 border-b bg-white p-2 dark:bg-gray-950">
                    <Input
                      placeholder="Пошук користувача..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      type="search"
                    />
                  </div>
                  <SelectGroup>
                    {filteredUsers.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Користувачів не знайдено
                      </SelectItem>
                    ) : (
                      filteredUsers.map((user) => (
                        <SelectItem
                          key={user.id}
                          value={user.id}
                          className="truncate"
                        >
                          {user.email}
                          {user.user_metadata?.first_name && (
                            <span className="ml-2 truncate text-gray-500">
                              ({user.user_metadata.first_name}{" "}
                              {user.user_metadata.last_name})
                            </span>
                          )}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Select
              onValueChange={(value) => setSelectedRole(value as AdminRoles)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Оберіть роль" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!selectedUser || !selectedRole || isLoading}
          >
            {isLoading ? "Додавання..." : "Додати"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
