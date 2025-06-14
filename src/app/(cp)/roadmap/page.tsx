"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { Button } from "@/components"
import {
  fetchGetRoadmap,
  fetchRewriteRoadmap,
  lng,
} from "./_components/fetchRoadmap"

export default function WalletsAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [aggregatedValue] = useState<string | number | null>(null)
  const [roadmapText, setRoadmapText] = useState("")
  const [language, setLanguage] = useState<lng>("ru")

  const loadRoadmap = async (lng: lng) => {
    setIsLoading(true)
    try {
      const text = await fetchGetRoadmap(lng)
      setRoadmapText(text)
    } catch (e) {
      console.error("Помилка при завантаженні roadmap:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRewrite = async () => {
    setIsLoading(true)
    try {
      await fetchRewriteRoadmap({ newRoadmapText: roadmapText, lng: language })
      alert("Roadmap успішно оновлено")
    } catch (e) {
      console.error("Помилка при переписуванні roadmap:", e)
      alert("Не вдалося оновити roadmap")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRoadmap(language)
  }, [language])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Roadmap</h1>
        {!isLoading && aggregatedValue && (
          <Badge variant="indigo" className="px-3 py-1 text-base">
            {aggregatedValue}
          </Badge>
        )}
      </div>

      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Button onClick={handleRewrite} disabled={isLoading}>
            {isLoading ? "Завантаження..." : "Переписати дорожню карту"}
          </Button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage("en")}
              className={`rounded border px-3 py-1 text-sm font-medium ${
                language === "en"
                  ? "bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ru")}
              className={`rounded border px-3 py-1 text-sm font-medium ${
                language === "ru"
                  ? "bg-gray-800 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              RU
            </button>
          </div>
        </div>

        <textarea
          className="h-[500px] w-full resize-none rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
          placeholder="Введіть опис roadmap тут..."
          value={roadmapText}
          onChange={(e) => setRoadmapText(e.target.value)}
          disabled={isLoading}
        />
      </Card>
    </>
  )
}
