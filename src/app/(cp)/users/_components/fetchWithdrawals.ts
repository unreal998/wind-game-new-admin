import axios from "axios"

export const fetchWithdrawals = async () => {
  const response = await axios.get(
    `https://turbinextesst.ngrok-free.dev/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
