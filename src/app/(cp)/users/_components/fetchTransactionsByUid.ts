import axios from "axios"

export const fetchTransactionsByUid = async (uid: string) => {
  const response = await axios.get(
    `https://wind-game-be.fly.dev/transaction?uid=${uid}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
