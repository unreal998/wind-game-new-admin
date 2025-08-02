import axios from "axios"

export async function fetchGetTurxBalance() {
  const response = await axios.get(
    `https://01767df04bf7.ngrok-free.app/turx_dynamic`,
    // `http://localhost:3003`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
