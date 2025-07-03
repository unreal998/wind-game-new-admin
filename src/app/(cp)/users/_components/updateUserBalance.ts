import axios from "axios"

export const updateUserKWTBalance = async ({
  id,
  WindBalance,
}: {
  id: string
  WindBalance: number
}) => {
  const response = await axios.post(
    `https://2565-95-164-85-150.ngrok-free.app/user?uid=${id}`,
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
    `https://2565-95-164-85-150.ngrok-free.app/user?uid=${id}`,
    {
      TONBalance,
    },
  )
  return response.data.data
}
