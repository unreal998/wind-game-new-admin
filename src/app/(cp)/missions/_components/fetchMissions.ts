import axios from "axios"

export type Mission = {
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
  reward: number
  coin: string
  type: "daily" | "quest"
  specType: "depposite" | "countries" | "referrals" | "accumulation"
  specValue: string
}

export async function fetchMissions() {
  const missionsDataRequest = await axios.get(
    `https://aedf-95-164-85-150.ngrok-free.app/missions`,
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
    `https://aedf-95-164-85-150.ngrok-free.app/missions`,
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
    `https://aedf-95-164-85-150.ngrok-free.app/missions?id=${id}`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data
}
