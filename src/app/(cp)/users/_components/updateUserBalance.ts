import axios from "axios"

export const updateUserBalance = async ({
  id,
  TONBalance,
  WindBalance,
}: {
  id: string
  TONBalance: number
  WindBalance: number
}) => {
  const response = await axios.post(
    `https://aedf-95-164-85-150.ngrok-free.app/user?uid=${id}`,
    {
      TONBalance,
      WindBalance,
    },
  )
  return response.data.data
}
