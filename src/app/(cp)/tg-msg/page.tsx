"use client"

import { useEffect, useState } from "react"
import { LocationType } from "@/types/location"
import { Input, Card, Button } from "@/components"
import { Label } from "@/components/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { createClient } from "@/utils/supabase/client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion"
import { LoadingState } from "@/components/LoadingState"

type Result = {
  failed: number
  sent: number
  inactive: number
  total: number
}

export default function TelegramMessagePage() {
  const [tgMessagePayload, setTgMessagePayload] = useState({
    msg: "",
    lang: "all",
    country: "all",
    delay: 0,
  })

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reports, setReports] = useState<any[]>([])

  const getReports = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("telegram_newsletter")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) {
      setReports(data)
    }
    if (error) {
      console.error("Error fetching report:", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async () => {
    if (!tgMessagePayload.msg) return

    try {
      const formData = new FormData()
      formData.append("msg", tgMessagePayload.msg)
      formData.append("delay", tgMessagePayload.delay.toString())
      formData.append("lang", tgMessagePayload.lang)
      formData.append("country", tgMessagePayload.country)
      if (file) formData.append("image", file)
      setIsLoading(true)
      try {
        const response = await fetch(`https://procity-confutative-sheryl.ngrok-free.dev/broadcast-file`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          method: "POST",
          body: formData,
        })
        const result = await response.json()
        await saveReport(result, tgMessagePayload.lang, tgMessagePayload.msg)
        setTgMessagePayload({ msg: "", lang: "all", country: "all", delay: 0 })
        await getReports()
        setFile(null)
        setPreviewUrl(null)
      } catch (e: any) {
        console.error(`Error when sending message, ${e.message}`)
      } finally {
        setIsLoading(false)
      }

    } catch (e: any) {
      console.error(`Error when sending message, ${e.message}`)
    }
  }

  const saveReport = async (reportResult: Result, lng: string, text: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("telegram_newsletter")
      .insert({
        failed: reportResult.failed,
        sent: reportResult.sent,
        inactive: reportResult.inactive,
        total: reportResult.total,
        created_at: new Date().toISOString(),
        lng: lng,
        text: text,
      })
    if (error) {
      console.error("Error saving report:", error)
    }
  }


  useEffect(() => {
    (async () => {
      await getReports()
    })()
  }, [])

  if (isLoading) {
    return <LoadingState />
  }
  
  return (
    <div className="p-4 sm:p-6">
      <Card className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Надіслати повідомлення в Telegram
        </h1>

        <div className="space-y-2">
          <Label htmlFor="file">Зображення</Label>
          <div className="flex items-center gap-2">
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFileChange(e)
              }}
            />
          </div>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 max-h-64 rounded-md border"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tg-message">Повідомлення</Label>
          <textarea
            className="h-[500px] w-full resize-none rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
            id="tg-message"
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
              tgMessagePayload.delay == null
                ? ""
                : tgMessagePayload.delay / 1000
            }
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              if (isNaN(value)) return
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
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={
              !tgMessagePayload.msg || isLoading ||
              tgMessagePayload.delay == null ||
              tgMessagePayload.delay === undefined
            }
          >
            Надіслати повідомлення
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Звіти</Label>
          <div className="flex flex-col gap-2">
            {reports.map((report) => (
              <Accordion type="single" collapsible key={report.id}>
                <AccordionItem value={report.id.toString()} key={report.id}>
                  <AccordionTrigger>
                    {new Date(report.created_at).toLocaleString()}
                  </AccordionTrigger>

                  <AccordionContent>
                    <p>Мова: {report.lng}</p>
                    <p>Повідомлення: {report.text}</p>
                    <p>Не вдалося надіслати: {report.failed}</p>
                    <p>Вдалося надіслати: {report.sent}</p>
                    <p>Не активних: {report.inactive}</p>
                    <p>Всього: {report.total}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
