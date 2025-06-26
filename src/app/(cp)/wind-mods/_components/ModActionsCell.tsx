import { Button } from "@/components/Button"
import { useAdminWindModsStore } from "@/stores/admin/useAdminWindModsStore"
import { WindMod } from "@/types/windMod"

const ModActionsCell = ({ mod }: { mod: WindMod }) => {
  const { setActiveWindMod } = useAdminWindModsStore()

  return (
    <Button variant="ghost" size="sm" onClick={() => setActiveWindMod(mod)}>
      Редагувати
    </Button>
  )
}

export default ModActionsCell
