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
    "https://3623de90c38f.ngrok-free.app/tonChanges",
  )
  return response.data.data
}
