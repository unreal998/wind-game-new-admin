import axios from "axios"

export const fetchWithdrawals = async () => {
  const response = await axios.get(
    `https://01767df04bf7.ngrok-free.app/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
