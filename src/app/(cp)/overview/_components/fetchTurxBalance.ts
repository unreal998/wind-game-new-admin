import axios from "axios"

export async function fetchGetTurxBalance() {
  const response = await axios.get(
    `https://60d211c58427.ngrok-free.app/turx_dynamic`,
    // `http://localhost:3003`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
