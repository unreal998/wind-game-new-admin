import axios from "axios"

export const fetchWithdrawals = async () => {
  const response = await axios.get(
    `https://3623de90c38f.ngrok-free.app/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
