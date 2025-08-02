import axios from "axios"

export const fetchTransactionsByUid = async (uid: string) => {
  const response = await axios.get(
    `https://01767df04bf7.ngrok-free.app/transaction?uid=${uid}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
