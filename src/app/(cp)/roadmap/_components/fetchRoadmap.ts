import axios from "axios"

export type lng = "ru" | "en"

export type RewriteRoadmapRequest = {
  newRoadmapText: string
  lng: lng
}

export const fetchGetRoadmap = async (lng: lng) => {
  const response = await axios.get(
    `https://aedf-95-164-85-150.ngrok-free.app/roadmap?lng=${lng}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data
}

export const fetchRewriteRoadmap = async ({
  newRoadmapText,
  lng,
}: RewriteRoadmapRequest) => {
  const response = await axios.put(
    `https://aedf-95-164-85-150.ngrok-free.app/roadmap?lng=${lng}`,
    { data: newRoadmapText },
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data
}
