import axios from "axios"

export const fetchWithdrawals = async () => {
  const response = await axios.get(
    `https://6d6ed6665a16.ngrok-free.app/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
