import axios from "axios"

export type TonChange = {
  id: string
  created_at: string
  uid: string
  tid: number
  sum: number
  source: string
}

export async function getTonChanges(): Promise<TonChange[]> {
  const response = await axios.get(
    "https://turbinextesst.ngrok-free.dev/tonChanges",
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    },
  )
  return response.data
}
