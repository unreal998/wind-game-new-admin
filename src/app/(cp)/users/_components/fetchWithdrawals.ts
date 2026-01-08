import axios from "axios"

export const fetchWithdrawals = async () => {
  const response = await axios.get(
    `https://wind-game-be.fly.dev/withdraw/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
