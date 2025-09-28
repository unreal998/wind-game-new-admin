import axios from "axios"

export const fetchTransactionsByUid = async (uid: string) => {
  const response = await axios.get(
    `https://generously-nonfluorescent-marivel.ngrok-free.dev/transaction?uid=${uid}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
