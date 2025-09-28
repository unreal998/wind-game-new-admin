import axios from "axios"

export async function fetchGetTurxBalance() {
  const response = await axios.get(
    `https://turbinex.pp.ua/turx_dynamic`,
    // `https://turbinex.pp.ua`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
