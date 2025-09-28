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
    "https://generously-nonfluorescent-marivel.ngrok-free.dev/tonChanges",
  )
  return response.data.data
}
