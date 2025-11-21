import { useAdminLocationsStore } from "@/stores/admin/useAdminLocationsStore"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { useState, useEffect } from "react"

export function LocationEditSidebar() {
  const { activeLocation, updateLocation, setActiveLocation } = useAdminLocationsStore()
  const [basicBonusPerClick, setBasicBonusPerClick] = useState(0)
  const [percentIncome, setPercentIncome] = useState(0)
  const [referalsToUnlock, setReferalsToUnlock] = useState(0)
  const [unlockPrice, setUnlockPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activeLocation) {
      setBasicBonusPerClick(activeLocation.basicBonusPerClick || 0)
      setReferalsToUnlock(activeLocation.referalsToUnlock || 0)
      setUnlockPrice(activeLocation.unlockPrice || 0)
      setPercentIncome(activeLocation.percent_income || 0)
    }
  }, [activeLocation])

  const handleSave = async () => {
    if (!activeLocation) return

    setIsLoading(true)
    try {
      await updateLocation(activeLocation.id, {
        basicBonusPerClick: Number(basicBonusPerClick),
        referalsToUnlock: Number(referalsToUnlock),
        unlockPrice: Number(unlockPrice),
        percent_income: Number(percentIncome),
      })
      setActiveLocation(null)
    } catch (error) {
      console.error("Failed to update location:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeLocation) return null

  return (
    <div>
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-40 dark:bg-gray-900 dark:bg-opacity-70 transition-opacity"
        onClick={() => setActiveLocation(null)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">
              Редагувати локацію: {activeLocation?.title}
            </h2>
            <button
              onClick={() => setActiveLocation(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="text-sm font-medium dark:text-gray-200">
                Базова енергія за клік
              </label>
              <Input
                type="number"
                value={basicBonusPerClick}
                onChange={(e) => setBasicBonusPerClick(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium dark:text-gray-200">
                Необхідно рефералів
              </label>
              <Input
                type="number"
                value={referalsToUnlock}
                onChange={(e) => setReferalsToUnlock(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium dark:text-gray-200">
                Ціна розблокування
              </label>
              <Input
                type="number"
                value={unlockPrice}
                onChange={(e) => setUnlockPrice(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium dark:text-gray-200">
                % дохід
              </label>
              <Input
                type="number"
                value={percentIncome}
                onChange={(e) => setPercentIncome(Number(e.target.value))}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={() => setActiveLocation(null)}
            >
              Скасувати
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Збереження..." : "Зберегти"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
