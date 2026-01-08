import axios from "axios"

export type Mission = {
  created_at:string
  id: number
  img: string
  title: { en: string; ru: string }
  description: { en: string; ru: string }
  reward: number
  coin: string
  type: "daily" | "quest"
}

type MissionsData = {
  id: number
  img: string
  title: { [key: string]: string }
  description: { [key: string]: string }
  reward: number
  coin: string
  type: "daily" | "quest"
  specType: "depposite" | "countries" | "referrals" | "accumulation"
  specValue: string
}

export type CreateMissionData = {
  img: string
  title: { [key: string]: string }
  description: { [key: string]: string }
  reward: number | string
  coin: string
  type: "daily" | "quest"
  specType: "depposite" | "countries" | "referrals" | "accumulation" | ""
  specValue: string
}

export async function fetchMissions() {
  const missionsDataRequest = await axios.get(
    `https://wind-game-be.fly.dev/missions`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return missionsDataRequest.data.data
}

export async function fetchAddMissions(createMissionData: CreateMissionData) {
  const missionsDataRequest = await axios.put(
    `https://wind-game-be.fly.dev/missions`,
    createMissionData,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return missionsDataRequest.data.data
}

export async function fetchDeleteMission(id: MissionsData["id"]) {
  const response = await axios.delete(
    `https://wind-game-be.fly.dev/missions?id=${id}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data
}
