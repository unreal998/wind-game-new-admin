import axios from "axios"

export const fetchWithdrawals = async () => {
  const response = await axios.get(
    `https://b233eb9b0fa9.ngrok-free.app/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
