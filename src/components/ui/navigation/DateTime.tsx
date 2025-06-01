"use client"

import { useEffect, useState } from "react"

import { Tooltip } from "@/components/Tooltip"
import { Icon } from "@iconify/react"

export const DateTime = () => {
  const [serverTime, setServerTime] = useState<string>("")
  const [currentHour, setCurrentHour] = useState(
    new Date().getHours() % 12 || 12,
  )

  useEffect(() => {
    const updateServerTime = () => {
      const now = new Date()
      const dateTimeString = now.toLocaleString("uk-UA", {
        timeZone: "Europe/Kiev",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      setServerTime(`${dateTimeString}`)
    }

    updateServerTime()
    const intervalId = setInterval(updateServerTime, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours() % 12 || 12)
    }, 60000) // Оновлюємо кожну хвилину

    return () => clearInterval(timer)
  }, [])
  return (
    <>
      <Icon
        icon={`lucide:clock-${currentHour}`}
        width={16}
        height={16}
        aria-hidden="true"
      />

      <Tooltip content="Australia, Sydney, UTC+11">
        <p className="font-mono text-sm">{serverTime}</p>
      </Tooltip>
    </>
  )
}
