import { StatsTable } from "./_components/StatsTable"

export default function TotalAdminPage() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Статистика</h1>
      </div>
      <div className="space-y-6">
        <StatsTable />
      </div>
    </>
  )
}
