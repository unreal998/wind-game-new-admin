import { CountryCodes } from "@/stores/admin/useAdminWindModsStore"

export type WindMod = {
  price: number
  tonValue: number
  turxValue: number
}

export type WindModData = {
  id: number
  created_at: string
  area: CountryCodes
  values: WindMod[]
}
