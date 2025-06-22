export default function Sum({ sum, label }: { sum: number; label: string }) {
  return (
    <h1
      className={
        "text-1xl m-1 bg-gray-200 p-2 font-semibold text-gray-900 dark:bg-gray-900 dark:text-gray-50"
      }
    >
      {label}: {(Math.round(sum * 100) / 100).toFixed(2)}
    </h1>
  )
}
