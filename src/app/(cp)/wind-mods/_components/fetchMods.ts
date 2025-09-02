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
    `https://b233eb9b0fa9.ngrok-free.app/modifier?area=${areaName}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return request.data.data.values
}
