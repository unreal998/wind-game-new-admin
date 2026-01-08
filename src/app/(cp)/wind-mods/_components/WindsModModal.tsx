"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button, Input } from "@/components"
import { cx, focusInput } from "@/lib/utils"
import axios from "axios"

export const WindsModModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({
    country: "usa",
    windSpeed: "",
    tonPrice: "",
    tonReward: "",
    turxReward: "",
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    await axios.post(`https://wind-game-be.fly.dev/modifier`, form, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
    onClose()
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-950"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="w-full text-center text-2xl font-bold text-gray-900 dark:text-white">
            Створити новий мод
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <select
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className={cx(
              "w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none sm:text-sm",
              "border-gray-300 bg-white text-gray-900 placeholder-gray-400",
              focusInput,
            )}
          >
            <option value="nl">Нідерланди</option>
            <option value="dk">Данія</option>
            <option value="gr">Німеччина</option>
            <option value="usa">США</option>
          </select>

          <Input
            type="number"
            placeholder="TON Price"
            value={form.tonPrice}
            onChange={(e) => handleChange("tonPrice", e.target.value)}
          />

          <Input
            type="number"
            placeholder="TON Reward"
            value={form.tonReward}
            onChange={(e) => handleChange("tonReward", e.target.value)}
          />

          <Input
            type="number"
            placeholder="kwt Reward"
            value={form.turxReward}
            onChange={(e) => handleChange("turxReward", e.target.value)}
          />

          <div className="mt-6 flex justify-between">
            <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
              Відміна
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Прийняти
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WindsModModal
