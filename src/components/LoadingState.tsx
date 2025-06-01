"use client"

export function LoadingState() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-600" />
        <div className="text-sm text-gray-500">Завантаження...</div>
      </div>
    </div>
  )
}
