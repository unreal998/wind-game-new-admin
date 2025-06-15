import axios from "axios"

export type ModsValues = {
  price: number
  speed: number
  tonValue: number
  turxValue: number
}

export type ModsItemType = {
  windSpeed: number
  selectedArea: string
  uid: string
}

export async function fetchMods(areaName: string) {
  const request = await axios.get(
    `https://aedf-95-164-85-150.ngrok-free.app/modifier?area=${areaName}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return request.data.data.values
}
