"use client"

import { getTransaction, updateTransaction } from "@/actions/transactions"
import { Button } from "@/components/Button"
import { Callout } from "@/components/Callout"
import { DatePicker } from "@/components/DatePicker"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { Textarea } from "@/components/Textarea"
import { formatTimestamp } from "@/hooks/formatTimestamp"
import { useFormattedDistance } from "@/hooks/useFormattedDistance"
import { cx } from "@/lib/utils"
import { Database } from "@/utils/supabase/database.types"
import { RiEditLine, RiInfoCardLine } from "@remixicon/react"
import { toZonedTime } from "date-fns-tz"
import { uk } from "date-fns/locale"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  TRANSLATIONS_DATEPICKER,
} from "./constants"

type TransactionDetails = {
  date?: number
  txid?: string
}

type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  details?: TransactionDetails
}

interface EditTransactionDrawerProps {
  transactionId: string
  onClose: () => void
  onUpdate?: () => Promise<void>
}

const labelStyles = {
  base: "flex gap-x-1 text-sm font-medium transition-colors duration-200",
  readonly: "text-gray-700 dark:text-gray-300",
  editable: "text-indigo-600 dark:text-indigo-400",
}

const localTimeZone = process.env.NEXT_PUBLIC_TIMEZONE || "Europe/Kiev"

export function EditTransactionDrawer({
  transactionId,
  onClose,
  onUpdate,
}: EditTransactionDrawerProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const formatDistance = useFormattedDistance()

  // Стан для відстеження змінених полів
  const [changedFields, setChangedFields] = useState<Partial<Transaction>>({})
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
    {},
  )

  // Refs для фокусу на полях при редагуванні
  const inputRefs = useRef<
    Partial<Record<keyof Transaction, HTMLInputElement>>
  >({})

  const setInputRef =
    (field: keyof Transaction) => (el: HTMLInputElement | null) => {
      if (el) inputRefs.current[field] = el
    }

  // Завантаження транзакції
  useEffect(() => {
    const loadTransaction = async () => {
      if (!transactionId) return

      try {
        const data = await getTransaction(transactionId)
        setTransaction(data)
        // Скидаємо стани при завантаженні нової транзакції
        setChangedFields({})
        setEditableFields({})
      } catch (error) {
        console.error("Error loading transaction:", error)
        toast.error("Помилка завантаження транзакції")
      }
    }

    loadTransaction()
  }, [transactionId])

  const handleFieldChange = (field: keyof Transaction, value: any) => {
    if (!transaction || !editableFields[field]) return

    // Оновлюємо тільки якщо значення змінилось
    if (value !== transaction[field]) {
      setChangedFields((prev) => ({ ...prev, [field]: value }))
    } else {
      // Якщо значення таке ж як в оригіналі - видаляємо з changedFields
      const { [field]: _, ...rest } = changedFields
      setChangedFields(rest)
    }
  }

  const toggleFieldEdit = (field: keyof Transaction) => {
    const newEditState = !editableFields[field]
    setEditableFields((prev) => ({ ...prev, [field]: newEditState }))

    // Якщо вимикаємо редагування
    if (!newEditState && transaction) {
      const originalValue = transaction[field]
      const changedValue = changedFields[field]

      if (changedValue === originalValue) {
        const { [field]: _, ...rest } = changedFields
        setChangedFields(rest)
      }
    }

    // Фокус на полі при включенні редагування
    if (newEditState) {
      setTimeout(() => {
        const input = inputRefs.current[field]
        if (input) {
          input.focus()
          input.select()
        }
      }, 0)
    }
  }

  const handleClose = () => {
    setTransaction(null)
    setChangedFields({})
    setEditableFields({})
    onClose()
  }

  const handleSave = async () => {
    if (!transaction || !Object.keys(changedFields).length) return

    setIsLoading(true)
    try {
      await updateTransaction(transaction.id, changedFields)
      toast.success("Транзакцію оновлено")
      if (onUpdate) await onUpdate()
      handleClose()
    } catch (error) {
      console.error("Error updating transaction:", error)
      toast.error("Помилка оновлення транзакції")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (!editableFields.created_at || !date) return
    handleFieldChange("created_at", date.toISOString())
  }

  // Додаємо стан для тексту JSON
  const [detailsText, setDetailsText] = useState("")

  // Оновлюємо текст при зміні транзакції або changedFields
  useEffect(() => {
    if (changedFields.details) {
      setDetailsText(JSON.stringify(changedFields.details, null, 2))
    } else if (transaction?.details) {
      setDetailsText(JSON.stringify(transaction.details, null, 2))
    } else {
      setDetailsText("{}")
    }
  }, [transaction?.details, changedFields.details])

  if (!transaction) return null

  return (
    <Drawer open={!!transactionId} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Редагування транзакції</DrawerTitle>
          <DrawerDescription>ID: {transaction.id}</DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-4">
          {/* Type and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-1">
              <div className="flex h-8 items-center justify-between">
                <label className={cx(labelStyles.base, labelStyles.readonly)}>
                  Тип
                </label>
              </div>
              <Input
                type="copy"
                value={
                  TRANSACTION_TYPES.find((t) => t.value === transaction.type)
                    ?.label || ""
                }
                readOnly
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <div className="flex h-8 items-center justify-between">
                <label
                  className={cx(
                    labelStyles.base,
                    editableFields.status
                      ? labelStyles.editable
                      : labelStyles.readonly,
                  )}
                >
                  <span className="flex items-center gap-x-2">
                    {editableFields.status && (
                      <RiEditLine className="size-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                    <span>Статус</span>
                  </span>
                </label>
                {!editableFields.status && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEdit("status")}
                  >
                    <RiEditLine className="size-4" />
                  </Button>
                )}
              </div>
              {editableFields.status ? (
                <Select
                  value={String(transaction.status) || ""}
                  onValueChange={(value) => handleFieldChange("status", value)}
                  disabled={!editableFields.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type="copy"
                  value={
                    TRANSACTION_STATUSES.find(
                      (s) => s.value === transaction.status,
                    )?.label || ""
                  }
                  readOnly
                />
              )}
            </div>
          </div>

          {/* Amounts Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-1">
              <div className="flex h-8 items-center justify-between">
                <label
                  className={cx(
                    labelStyles.base,
                    editableFields.amount
                      ? labelStyles.editable
                      : labelStyles.readonly,
                  )}
                >
                  <span className="flex items-center gap-x-2">
                    {editableFields.amount && (
                      <RiEditLine className="size-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                    <span>Сума</span>
                  </span>
                </label>
                {!editableFields.amount && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEdit("amount")}
                  >
                    <RiEditLine className="size-4" />
                  </Button>
                )}
              </div>
              <Input
                ref={setInputRef("amount")}
                type={!editableFields.amount ? "copy" : "number"}
                value={changedFields.amount ?? transaction.amount}
                onChange={(e) =>
                  handleFieldChange("amount", Number(e.target.value))
                }
                readOnly={!editableFields.amount}
              />
            </div>

            {/* Commission */}
            {/* <div className="space-y-1">
              <div className="flex h-8 items-center justify-between">
                <label
                  className={cx(
                    labelStyles.base,
                    editableFields.commission
                      ? labelStyles.editable
                      : labelStyles.readonly,
                  )}
                >
                  <span className="flex items-center gap-x-2">
                    {editableFields.commission && (
                      <RiEditLine className="size-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                    <span>Комісія</span>
                  </span>
                </label>
                {!editableFields.commission && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEdit("commission")}
                  >
                    <RiEditLine className="size-4" />
                  </Button>
                )}
              </div>
              <Input
                ref={setInputRef("commission")}
                type={!editableFields.commission ? "copy" : "number"}
                value={changedFields.commission ?? transaction.commission}
                onChange={(e) =>
                  handleFieldChange("commission", Number(e.target.value))
                }
                readOnly={!editableFields.commission}
              />
            </div> */}
          </div>

          {/* Final Amount and Created At Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Final Amount */}
            <div className="space-y-1">
              <div className="flex h-8 items-center justify-between">
                <label className={cx(labelStyles.base, labelStyles.readonly)}>
                  <span>Фінальна сума</span>
                </label>
              </div>
              <Input type="copy" value={transaction.amount} readOnly />
            </div>

            {/* Created At */}
            <div className="space-y-1">
              <div className="flex h-8 items-center justify-between">
                <label
                  className={cx(
                    labelStyles.base,
                    editableFields.created_at
                      ? labelStyles.editable
                      : labelStyles.readonly,
                    "flex-col",
                  )}
                >
                  <span>Дата</span>
                  <span className="text-xs text-gray-500">
                    {transaction.created_at &&
                      formatDistance(transaction.created_at)}
                  </span>
                </label>
                {!editableFields.created_at && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEdit("created_at")}
                  >
                    <RiEditLine className="size-4" />
                  </Button>
                )}
              </div>
              {!editableFields.created_at ? (
                <Input
                  type="copy"
                  value={
                    transaction.created_at &&
                    formatTimestamp({
                      date: transaction.created_at,
                      formatOption: "dateTimeWithSeconds",
                    })
                  }
                  readOnly
                />
              ) : (
                <DatePicker
                  showTimePicker
                  value={
                    changedFields.created_at
                      ? toZonedTime(
                          new Date(changedFields.created_at),
                          localTimeZone,
                        )
                      : transaction.created_at
                        ? toZonedTime(
                            new Date(transaction.created_at),
                            localTimeZone,
                          )
                        : undefined
                  }
                  onChange={handleDateChange}
                  disabled={!editableFields.created_at}
                  locale={uk}
                  translations={TRANSLATIONS_DATEPICKER}
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1">
            <div className="flex h-8 items-center justify-between">
              <label
                className={cx(
                  labelStyles.base,
                  editableFields.details
                    ? labelStyles.editable
                    : labelStyles.readonly,
                )}
              >
                <span className="flex items-center gap-x-2">
                  {editableFields.details && (
                    <RiEditLine className="size-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <span>Деталі транзакції</span>
                </span>
              </label>
              {!editableFields.details && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFieldEdit("details")}
                >
                  <RiEditLine className="size-4" />
                </Button>
              )}
            </div>
            {!editableFields.details ? (
              <Callout>
                {transaction.details ? (
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(transaction.details, null, 2)}
                  </pre>
                ) : (
                  <p className="flex select-none items-center gap-x-2 opacity-30">
                    <RiInfoCardLine className="size-4" />
                    Деталі відсутні
                  </p>
                )}
              </Callout>
            ) : (
              <Textarea
                value={detailsText}
                onChange={(e) => {
                  const newText = e.target.value
                  setDetailsText(newText)

                  try {
                    const parsedDetails = JSON.parse(newText)
                    handleFieldChange("details", parsedDetails)
                  } catch (error) {
                    // Ігноруємо помилки парсингу під час введення
                  }
                }}
                readOnly={!editableFields.details}
                className="font-mono text-sm"
              />
            )}
          </div>
        </DrawerBody>

        <DrawerFooter className="flex w-full justify-end gap-4 sm:justify-between">
          <Button
            onClick={handleSave}
            disabled={
              !transactionId ||
              Object.keys(changedFields).length === 0 ||
              isLoading
            }
          >
            {isLoading ? "Збереження..." : "Зберегти"}
          </Button>
          <DrawerClose asChild>
            <Button variant="secondary">Скасувати</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
