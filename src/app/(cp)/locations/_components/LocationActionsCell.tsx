import { useAdminLocationsStore } from "@/stores/admin/useAdminLocationsStore"
import { Button } from "@/components/Button"

const LocationActionsCell = ({ location }: { location: any }) => {
  const { setActiveLocation } = useAdminLocationsStore()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setActiveLocation(location)}
    >
      Редагувати
    </Button>
  )
}

export default LocationActionsCell
