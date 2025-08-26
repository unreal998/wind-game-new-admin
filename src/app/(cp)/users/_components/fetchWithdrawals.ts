import axios from "axios"

export const fetchWithdrawals = async () => {
  const response = await axios.get(
    `https://60d211c58427.ngrok-free.app/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
