import axios from "axios"

export interface WithdrawalData {
  id: string
  amount: number
  date: string
  uid?: string
  wallet: string
  MEMO?: string
  status: "new" | "completed" | "declined"
}

export interface Withdrawal {
  withdrawalsData: WithdrawalData[]
  loading: boolean
  error: string | null
}

export const fetchWithdrawalsApi = async () => {
  const response = await axios.get(
    `https://generously-nonfluorescent-marivel.ngrok-free.dev/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}

export const fetchUpdateWithDrawStatus = async ({
  id,
  status,
}: {
  id: WithdrawalData["id"]
  status: "completed" | "declined"
}) => {
  const response = await axios.put(
    `https://generously-nonfluorescent-marivel.ngrok-free.dev/withdraw/status?status=${status}&id=${id}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
