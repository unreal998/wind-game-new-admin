"use client"

import { Button } from "@/components/Button"
import { RiCheckboxCircleLine, RiFileCopyLine } from "@remixicon/react"
import { useState } from "react"

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={handleCopy}
      title="Скопіювати"
    >
      {copied ? (
        <RiCheckboxCircleLine className="size-4 text-green-500" />
      ) : (
        <RiFileCopyLine className="size-4 text-gray-500" />
      )}
    </Button>
  )
}
