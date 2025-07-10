export default function NotAllowed() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="text-5xl">🚫</div>
      <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Доступ заборонено
      </div>
      <div className="text-gray-500 dark:text-gray-400">
        У вас немає прав для перегляду цієї сторінки.
      </div>
    </div>
  )
}
