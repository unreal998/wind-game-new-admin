import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { useState, useEffect } from "react"
import {
  countryCodeToNameMap,
  useAdminWindModsStore,
} from "@/stores/admin/useAdminWindModsStore"

export function ModEditSidebar() {
  const {
    activeWindMod,
    selectedCountry,
    updateActiveWindMod,
    setActiveWindMod,
  } = useAdminWindModsStore()

  const [turxPerPush, setTurxPerPush] = useState(0)
  const [tonPerPush, setTonPerPush] = useState(0)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activeWindMod) {
      setTurxPerPush(activeWindMod.turxValue || 0)
      setTonPerPush(activeWindMod.tonValue || 0)
    }
  }, [activeWindMod])

  const handleSave = async () => {
    if (!activeWindMod) return

    setIsLoading(true)
    try {
      await updateActiveWindMod(selectedCountry, {
        price: activeWindMod.price,
        turxValue: Number(turxPerPush),
        tonValue: Number(tonPerPush),
      })
      setActiveWindMod(null)
    } catch (error) {
      console.error("Failed to update location:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeWindMod) return null

  return (
    <div>
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity dark:bg-gray-900 dark:bg-opacity-70"
        onClick={() => setActiveWindMod(null)}
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-96 flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-white">
              Редагувати локацію: {countryCodeToNameMap[selectedCountry]}
            </h2>
            <button
              onClick={() => setActiveWindMod(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm font-medium dark:text-gray-200">
                TURX дохід
              </label>
              <Input
                type="number"
                value={turxPerPush}
                onChange={(e) => setTurxPerPush(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium dark:text-gray-200">
                TON дохід
              </label>
              <Input
                type="number"
                value={tonPerPush}
                onChange={(e) => setTonPerPush(Number(e.target.value))}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button variant="ghost" onClick={() => setActiveWindMod(null)}>
              Скасувати
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Збереження..." : "Зберегти"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
