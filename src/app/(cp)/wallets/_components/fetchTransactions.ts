import axios from "axios"

export const fetchTransactionsApi = async () => {
  const response = await axios.get(
    `https://aedf-95-164-85-150.ngrok-free.app/transaction/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
