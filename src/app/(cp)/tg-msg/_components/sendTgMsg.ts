import { LocationType } from "@/types/location"
import axios from "axios"

export type TgMsgPayload = {
  msg: string
  lang: "ru" | "uk" | "en" | "all"
  country: LocationType | "all"
  delay: number
}

export async function sendTgMsg(tgMsgPayload: TgMsgPayload) {
  await axios.post(
    "https://60d211c58427.ngrok-free.app/tgbot/send-msg",
    tgMsgPayload,
  )
  return
}
