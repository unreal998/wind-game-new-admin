import axios from "axios"

export const updateUserKWTBalance = async ({
  id,
  WindBalance,
}: {
  id: string
  WindBalance: number
}) => {
  const response = await axios.post(
    `https://generously-nonfluorescent-marivel.ngrok-free.dev/user?uid=${id}`,
    {
      WindBalance,
    },
  )
  return response.data.data
}

export const updateUserTONBalance = async ({
  id,
  TONBalance,
}: {
  id: string
  TONBalance: number
}) => {
  const response = await axios.post(
    `https://generously-nonfluorescent-marivel.ngrok-free.dev/user?uid=${id}`,
    {
      TONBalance,
    },
  )
  return response.data.data
}

export const replenishUserTONBalance = async ({
  wallet,
  amount,
}: {
  wallet: string
  amount: number
}) => {
  const response = await axios.post(
    `https://generously-nonfluorescent-marivel.ngrok-free.dev/transaction/ipn`,
    {
      to: wallet,
      amount: amount,
      txid: '1w23uui8890bbh1y7u9it5r2cv2g'
    },
  )
  return response.data
}
