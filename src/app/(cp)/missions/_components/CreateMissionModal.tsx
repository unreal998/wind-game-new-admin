"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button, Input } from "@/components"
import { cx, focusInput } from "@/lib/utils"
import { CreateMissionData, fetchAddMissions } from "./fetchMissions"

export const CreateMissionModal = ({
  onClose,
  setNewMission,
}: {
  onClose: () => void
  setNewMission: (mission: any) => void
}) => {
  const [language, setLanguage] = useState<"ru" | "en">("ru")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [form, setForm] = useState<CreateMissionData>({
    img: "",
    title: { en: "", ru: "" },
    description: { en: "", ru: "" },
    reward: "",
    coin: "TURX",
    type: "quest",
    specType: "",
    specValue: "0",
  })

  useEffect(() => {
    if (!showAdvanced) return

    setForm((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [language]: getDescriptionPrefix(
          prev.specType,
          language,
          prev.specValue,
        ),
      },
    }))
  }, [form.specType, form.specValue, language, showAdvanced])

  const getDescriptionPrefix = (
    specType: string,
    lang: "ru" | "en",
    value: string,
  ): string => {
    const templates: Record<
      string,
      Record<"ru" | "en", (val: string) => string>
    > = {
      depposite: {
        en: (val) => `Refill your balance for ${val} TON`,
        ru: (val) => `Пополнить баланс на ${val} TON`,
      },
      countries: {
        en: (val) => `Open ${val} countries`,
        ru: (val) => `Открыть ${val} стран`,
      },
      referrals: {
        en: (val) => `Invite ${val} referral(s)`,
        ru: (val) => `Пригласить ${val} рефералов`,
      },
      accumulation: {
        en: (val) => `Accumulate ${val} kwt`,
        ru: (val) => `Накопить ${val} квт`,
      },
    }

    const templateFn = templates[specType]?.[lang]
    return templateFn ? templateFn(value) : ""
  }

  const handleChange = (field: string, value: string | number) => {
    if (field === "title" || field === "description") {
      setForm((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [language]: value,
        },
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSubmit = async () => {
    try {
      const rewardNumber = Number(form.reward)
      if (rewardNumber <= 0) {
        alert("Нагорода має бути більшою за нуль")
        return
      }
      if (form.reward === "" || isNaN(rewardNumber)) {
        console.log(rewardNumber)
        alert("Впишіть число в поле Нагороди")
        return
      }
      await fetchAddMissions({
        ...form,
        reward: rewardNumber, // convert to number for API
      })
      setForm({
        img: "",
        title: { en: "", ru: "" },
        description: { en: "", ru: "" },
        reward: "",
        coin: "TURX",
        type: "quest",
        specType: "",
        specValue: "0",
      })
      onClose()
      setNewMission({ ...form, created_at: new Date().toISOString() })
    } catch (error) {
      console.error("Помилка при створенні місії:", error)
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
            Створити місію
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="URL картинки"
            className={cx(
              "w-full",
              "relative block appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
              "border-gray-300 dark:border-gray-800",
              "text-gray-900 dark:text-gray-50",
              "placeholder-gray-400 dark:placeholder-gray-500",
              "bg-white dark:bg-gray-950",
              focusInput,
            )}
            value={form.img}
            onChange={(e) => handleChange("img", e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLanguage("ru")}
              className={cx(
                "w-full rounded-md border px-3 py-1.5 text-sm font-medium transition",
                language === "ru"
                  ? "bg-indigo-500 text-white"
                  : "border-indigo-500 bg-transparent text-indigo-500",
              )}
            >
              Ru
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={cx(
                "w-full rounded-md border px-3 py-1.5 text-sm font-medium transition",
                language === "en"
                  ? "bg-indigo-500 text-white"
                  : "border-indigo-500 bg-transparent text-indigo-500",
              )}
            >
              En
            </button>
          </div>
          <input
            type="text"
            placeholder="Назва"
            className={cx(
              "w-full",
              "relative block appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
              "border-gray-300 dark:border-gray-800",
              "text-gray-900 dark:text-gray-50",
              "placeholder-gray-400 dark:placeholder-gray-500",
              "bg-white dark:bg-gray-950",
              focusInput,
            )}
            value={form.title[language]}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <textarea
            placeholder="Опис"
            className={cx(
              "w-full",
              "relative block appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
              "border-gray-300 dark:border-gray-800",
              "text-gray-900 dark:text-gray-50",
              "placeholder-gray-400 dark:placeholder-gray-500",
              "bg-white dark:bg-gray-950",
              focusInput,
            )}
            rows={3}
            value={form.description[language]}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Нагорода"
            value={form.reward}
            onChange={(e) => handleChange("reward", e.target.value)}
          />

          <select
            value={form.coin}
            onChange={(e) => handleChange("coin", e.target.value)}
            className={cx(
              "w-full",
              "relative block appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
              "border-gray-300 dark:border-gray-800",
              "text-gray-900 dark:text-gray-50",
              "bg-white dark:bg-gray-950",
              focusInput,
            )}
          >
            <option value="TURX">кВт</option>
            <option value="TON">TON</option>
          </select>

          <select
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className={cx(
              "w-full",
              "relative block appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
              "border-gray-300 dark:border-gray-800",
              "text-gray-900 dark:text-gray-50",
              "bg-white dark:bg-gray-950",
              focusInput,
            )}
          >
            <option value="daily">Daily</option>
            <option value="quest">Quest</option>
          </select>

          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={(e) => setShowAdvanced(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <span>Увімкнути розширені параметри</span>
          </label>

          {showAdvanced && (
            <div className="rounded border border-gray-300 p-4 dark:border-gray-700">
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
                Розширені параметри
              </h3>

              <select
                value={form.specType}
                onChange={(e) => handleChange("specType", e.target.value)}
                className={cx(
                  "mb-3 w-full",
                  "relative block appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
                  "border-gray-300 dark:border-gray-800",
                  "text-gray-900 dark:text-gray-50",
                  "bg-white dark:bg-gray-950",
                  focusInput,
                )}
              >
                <option value="depposite">depposite</option>
                <option value="countries">countries</option>
                <option value="referrals">referrals</option>
                <option value="accumulation">accumulation</option>
              </select>

              <Input
                type="text"
                placeholder="Value"
                value={form.specValue}
                onChange={(e) => handleChange("specValue", e.target.value)}
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
