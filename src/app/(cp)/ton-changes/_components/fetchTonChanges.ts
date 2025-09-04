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
    // "https://b233eb9b0fa9.ngrok-free.app/tonChanges",
    "http://localhost:3003/tonChanges", // for testing by now
  )
  return response.data.data
}
