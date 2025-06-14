import axios from "axios"

export const fetchTransactionsByUid = async (uid: string) => {
  const response = await axios.get(
    `https://aedf-95-164-85-150.ngrok-free.app/transaction?uid=${uid}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
