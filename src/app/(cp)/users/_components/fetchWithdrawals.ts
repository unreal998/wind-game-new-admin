import axios from "axios"

export const fetchWithdrawals = async () => {
  const response = await axios.get(
    `https://2565-95-164-85-150.ngrok-free.app/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
