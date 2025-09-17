"use client"

import { LocationType } from "@/types/location"
import { useState } from "react"
import { sendTgMsg, TgMsgPayload } from "./_components/sendTgMsg"
import { Input, Card, Button } from "@/components"
import { Label } from "@/components/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"

export default function TelegramMessagePage() {
  const [tgMessagePayload, setTgMessagePayload] = useState<
    Omit<TgMsgPayload, "delay"> & { delay: number | null }
  >({
    msg: "",
    lang: "all",
    country: "all",
    delay: 0,
  })

  const handleSubmit = async () => {
    if (
      tgMessagePayload.msg === "" ||
      tgMessagePayload.delay === null ||
      tgMessagePayload.delay === undefined
    ) {
      return
    }

    try {
      await sendTgMsg(tgMessagePayload as TgMsgPayload)
    } catch (e: any) {
      console.log(`Error when sending message, ${e.message}`)
    } finally {
      setTgMessagePayload({ msg: "", lang: "all", country: "all", delay: 0 })
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <Card className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Надіслати повідомлення в Telegram
        </h1>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tg-message">Повідомлення</Label>
            <Input
              id="tg-message"
              type="text"
              placeholder="Введіть ваше повідомлення"
              value={tgMessagePayload.msg}
              onChange={(e) =>
                setTgMessagePayload((prev) => ({
                  ...prev,
                  msg: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delay">Затримка (в секундах)</Label>
            <Input
              id="delay"
              type="number"
              placeholder="Затримка"
              value={
                tgMessagePayload.delay === null
                  ? ""
                  : tgMessagePayload.delay / 1000
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  setTgMessagePayload((prev) => ({ ...prev, delay: null }))
                  return
                }
                const value = parseInt(e.target.value, 10)
                if (value < 0 || isNaN(value)) return
                setTgMessagePayload((prev) => ({
                  ...prev,
                  delay: value * 1000,
                }))
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Країна</Label>
              <Select
                value={tgMessagePayload.country}
                onValueChange={(value) =>
                  setTgMessagePayload((prev) => ({
                    ...prev,
                    country: value as LocationType | "all",
                  }))
                }
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Виберіть країну" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі</SelectItem>
                  <SelectItem value="netherlands">Нідерланди</SelectItem>
                  <SelectItem value="denmark">Данія</SelectItem>
                  <SelectItem value="germany">Німеччина</SelectItem>
                  <SelectItem value="usa">США</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Мова</Label>
              <Select
                value={tgMessagePayload.lang}
                onValueChange={(value) =>
                  setTgMessagePayload((prev) => ({
                    ...prev,
                    lang: value as "en" | "ru" | "uk" | "all",
                  }))
                }
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Виберіть мову" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі</SelectItem>
                  <SelectItem value="en">Англійська</SelectItem>
                  <SelectItem value="ru">Російська</SelectItem>
                  <SelectItem value="uk">Українська</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={
                !tgMessagePayload.msg ||
                tgMessagePayload.delay === null ||
                tgMessagePayload.delay === undefined
              }
            >
              Надіслати повідомлення
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
