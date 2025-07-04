import axios from "axios"

export async function fetchGetTurxBalance() {
  const response = await axios.get(
    //`https://2565-95-164-85-150.ngrok-free.app/turx_dynamic`,
    `http://localhost:3003`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
