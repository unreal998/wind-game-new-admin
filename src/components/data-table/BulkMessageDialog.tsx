"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/Textarea"
import { cx } from "@/lib/utils"
// import useAdminSupportStore from "@/stores/admin/useAdminSupportStore"
import { useUserStore } from "@/stores/useUserStore"
import { createClient } from "@/utils/supabase/client"
import { RiCloseLine } from "@remixicon/react"
import { useEffect, useState } from "react"
import { FlagImage } from "react-international-phone"
import { toast } from "sonner"

const supabase = createClient()

interface BulkMessageDialogProps {
  isOpen: boolean
  onClose: () => void
  userIds: string[]
}

interface UserInfo {
  user_id: string
  id: number
  first_name: string | null
  last_name: string | null
  country_code: string | null
}

export function BulkMessageDialog({
  isOpen,
  onClose,
  userIds: initialUserIds,
}: BulkMessageDialogProps) {
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserInfo[]>([])
  const userId = useUserStore((state) => state.user_id)
  // const createBulkTickets = useAdminSupportStore(
  //   (state) => state.createBulkTickets,
  // )

  // Отримуємо інформацію про рефералів при відкритті діалогу
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen || initialUserIds.length === 0) return

      try {
        const { data, error } = await supabase
          .from("admin_profiles_view")
          .select("user_id, id, first_name, last_name, country_code")
          .in("user_id", initialUserIds)

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("Помилка при завантаженні даних рефералів")
      }
    }

    fetchUsers()
  }, [isOpen, initialUserIds])

  const handleRemoveUser = (userIdToRemove: string) => {
    const newUsers = users.filter((user) => user.user_id !== userIdToRemove)
    setUsers(newUsers)

    // Якщо видалили останнього користувача, закриваємо діалог
    if (newUsers.length === 0) {
      onClose()
    }
  }

  const handleSubmit = async () => {
    if (!message.trim() || !subject.trim() || !userId || users.length === 0)
      return

    setIsLoading(true)
    try {
      // // Використовуємо нову функцію для створення тікетів
      // await createBulkTickets(
      //   users.map((user) => user.user_id),
      //   subject.trim(),
      //   message.trim(),
      // )

      toast.success("Повідомлення успішно відправлені")
      onClose()
      setMessage("")
      setSubject("")
    } catch (error) {
      console.error("Error sending bulk message:", error)
      toast.error("Помилка при відправці повідомлень")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div>
            <DialogTitle>
              {users.length > 1
                ? "Масова розсилка для рефералів"
                : "Написати рефералу"}
            </DialogTitle>
            <DialogDescription
              className={cx(
                "text-sm",
                users.length === 1 ? "sr-only" : undefined,
              )}
            >
              Повідомлення буде надіслано {users.length} користувачам
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <Badge
                key={user.user_id}
                className="flex items-center gap-2"
                variant="indigo"
              >
                <span className="flex items-center gap-2">
                  {user.country_code && (
                    <FlagImage
                      iso2={user.country_code.toLowerCase()}
                      size="16px"
                      className="rounded-sm"
                    />
                  )}
                  <span className="font-medium">{user.id}</span>
                  {user.first_name && user.last_name && (
                    <>
                      <span className="text-indigo-300 dark:text-indigo-400">
                        -
                      </span>
                      <span>
                        {`${user.first_name} ${user.last_name}`.trim()}
                      </span>
                    </>
                  )}
                </span>
                <button
                  type="button"
                  className="rounded-full transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemoveUser(user.user_id)
                  }}
                >
                  <RiCloseLine className="h-3 w-3 text-indigo-300 transition-colors hover:text-indigo-50 dark:text-indigo-400 dark:hover:text-white" />
                  <span className="sr-only">Видалити</span>
                </button>
              </Badge>
            ))}
          </div>

          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Введіть тему звернення..."
          />

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введіть текст повідомлення..."
            className="min-h-[120px]"
          />
        </div>

        <DialogFooter className="gap-4 sm:justify-between">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!message.trim() || !subject.trim() || isLoading}
          >
            {isLoading ? "Відправка..." : "Відправити"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Скасувати
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
