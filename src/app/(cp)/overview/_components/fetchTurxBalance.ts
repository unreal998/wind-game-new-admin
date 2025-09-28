import axios from "axios"

export async function fetchGetTurxBalance() {
  const response = await axios.get(
    `https://generously-nonfluorescent-marivel.ngrok-free.dev/turx_dynamic`,
    // `https://generously-nonfluorescent-marivel.ngrok-free.dev`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}
